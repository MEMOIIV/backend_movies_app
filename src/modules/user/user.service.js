import { asyncHandler, successResponse } from "../../utils/response.js";
import { decrypt, encrypt } from "../../utils/security/encryption.security.js";
import { generateLoginToken } from "../../utils/security/token.security.js";
import { roleEnum, UserModel } from "../../DB/models/User.Model.js";
import {
  comparHash,
  generateHash,
} from "../../utils/security/hash.security.js";
import * as DBService from "../../DB/db.service.js";
import { RevokeTokenModel } from "../../DB/models/Revoke.token.mode;.js";
import {
  deleteFolderByPrefix,
  deleteResources,
  destroyFile,
  uploadFile,
  uploadFiles,
} from "../../utils/multer/cloudinary.js";

// get profile
export const profile = asyncHandler(async (req, res, next) => {
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      _id: req.user._id,
    },
    populate: [
      {
        path: "messages",
      },
    ],
  });
  user.phone = await decrypt({ cipherText: req.user.phone });
  return successResponse({ res, data: user });
});
// get all profiles
export const allProfile = asyncHandler(async (req, res, next) => {
  const users = await DBService.find({
    model: UserModel,
    select: "_id firstName lastName gender createdAt updatedAt cover",
    populate: [
      {
        path: "messages",
      },
    ],
  });
  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found 😢" });
  }
  return successResponse({ res, data: users });
});
// sheared profile
export const shearProfile = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;
  const profile = await DBService.findOne({
    // findOne because we will check if this account verify or not
    model: UserModel,
    filter: { _id: profileId },
    select:
      "-password -confirmPassword -role -_id -block -OTPCount -__V -OtpCreatedAt -confirmEmailOtp",
  });
  return profile
    ? successResponse({ res, data: { profile } })
    : next(new Error("In-valid ProfileId", { cause: 404 }));
});
// get new refresh token
export const refreshToken = asyncHandler(async (req, res, next) => {
  const credentials = await generateLoginToken({ user: req.user });
  return successResponse({ res, data: { credentials } });
});
// update password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { password, oldPassword } = req.body;
  if (
    !(await comparHash({
      plaintext: oldPassword,
      hashValue: req.user.password,
    }))
  ) {
    return next(new Error("Incorrect current password"));
  }

  // for (const hash of req.user.olePasswordList || []) {
  //   if ((await comparHash({ plaintext: password, hashValue: hash }))) {
  //   return next(new Error("user have used this password before"));
  // }
  // }

  const hashPassword = await generateHash({ plaintext: password });
  const user = await DBService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      $set: {
        password: hashPassword,
        changeLoginCredentials: Date.now(),
      },
      $push: { olePasswordList: req.user.password },
      $inc: { __v: 1 },
    },
  });

  return successResponse({ res, message: "Password updated", data: user });
});
// update profile
export const updateBasicProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await encrypt({ plainText: req.body.phone });
  }
  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      $set: req.body,
      $inc: { __v: 1 },
    },
  });
  return user
    ? successResponse({ res, data: { user } })
    : next(new Error("Not register account", { cause: 404 }));
});
// freeze account
export const freezeAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin) {
    return next(
      new Error("regular users cannot deleted other accounts", { cause: 403 })
    );
  }
  const user = await DBService.updateOne({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      deletedAt: { $exists: false },
    },
    data: {
      $set: {
        deletedAt: Date.now(),
        deletedBy: req.user._id,
      },
      $unset: {
        restoreAt: 1,
        restoreBy: 1,
      },
      $inc: { __v: 1 },
    },
  });
  return user.matchedCount
    ? successResponse({
        res,
        data: { user },
        message: "deleted profile successfully",
      })
    : next(new Error("this account already deleted", { cause: 404 }));
});
// restore account
export const restoreAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin) {
    return next(
      new Error("regular users cannot restore other accounts", { cause: 403 })
    );
  }
  const user = await DBService.updateOne({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      restoreAt: { $exists: false },
      deletedAt: { $exists: true },
    },
    data: {
      $set: {
        restoreAt: Date.now(),
        restoreBy: req.user._id,
      },
      $unset: {
        deletedAt: 1,
        deletedBy: 1,
      },
      $inc: { __v: 1 },
    },
  });
  return user.matchedCount
    ? successResponse({
        res,
        data: { user },
        message: "restore profile successfully",
      })
    : next(new Error("this account already exists", { cause: 404 }));
});
// hard delete account
export const hardDeleted = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin) {
    return next(
      new Error("regular users cannot hard-deleted other accounts", {
        cause: 403,
      })
    );
  }
  const user = await DBService.deleteOne({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      deletedAt: { $exists: true },
    },
  });
  // 🔴 delete image form cloudinary 🔴 \\
  if (user.deletedCount) {
    await deleteFolderByPrefix({ prefix: `user/${userId}` });
    // await deleteSubFolder({prefix : `user/${userId}`})
    // await deleteFolder({prefix : `user/${userId}`})
  }
  return user.deletedCount
    ? successResponse({
        res,
        data: { user },
        message: "deleted profile successfully",
      })
    : next(new Error("this account already deleted", { cause: 404 }));
});

export const logout = asyncHandler(async (req, res, next) => {
  // console.log(req.decode);
  const { exp, jti } = req.decode;
  const Number_of_seconds_in_one_year = 60 * 60 * 24 * 365.25;
  const expires_after_one_year = exp + Number_of_seconds_in_one_year;
  // console.log({
  //   expiresAccessToken: new Date(exp * 1000),
  //   expiresRefreshToken: new Date(expires_after_one_year * 1000),
  // });

  const idToken = await DBService.create({
    model: RevokeTokenModel,
    field: [
      {
        idToken: jti,
        expiresAccessDate: exp,
        expiresRefreshDate: expires_after_one_year,
      },
    ],
  });
  return successResponse({
    res,
    data: { idToken },
    status: 201,
    message: " created successfully",
  });
});

// upload file
export const uploadOneFile = asyncHandler(async (req, res, next) => {
  const { secure_url, public_id } = await uploadFile({
    file: req.file,
    path: `user/${req.user._id}`,
  });
  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      img: { secure_url, public_id },
    },
    option: {
      new: false,
    },
  });
  if (user?.img.public_id) {
    await destroyFile({ public_id: user.img.public_id });
  }
  return successResponse({ res, data: { user } });
});

// console.log({serviceFile : req.file.finalPath});
// console.log({serviceFile : req.files});

// const user = await DBService.findOneAndUpdate({
//   model : UserModel,
//   filter :{_id : req.user._id},
//   data : {
//     $set : {img : req.file.finalPath}
//   }
// })

// let covers = []
// for (const file of req.files) {
//   covers.push(file.finalPath)
// }
// const user = await DBService.findOneAndUpdate({
//   model : UserModel,
//   filter :{_id : req.user._id},
//   data : {
//     $set : {cover : covers}
//   }

// })

export const uploadManyFile = asyncHandler(async (req, res, next) => {
  const attachments = await uploadFiles({
    files: req.files,
    path: `user/${req.user._id}/cover`,
  });
  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: req.user._id,
    },
    data: {
      cover: attachments,
    },
    option: {
      new: false,
    },
  });
  if (user?.cover.length) {
    await deleteResources({
      public_id: user.cover.map((ele) => ele.public_id),
    });
  }
  return successResponse({ res, data: { user } });
});
