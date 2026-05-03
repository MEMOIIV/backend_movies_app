import {
  providerEnum,
  roleEnum,
  UserModel,
} from "../../DB/models/User.Model.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import { encrypt } from "../../utils/security/encryption.security.js";
import {
  comparHash,
  generateHash,
} from "../../utils/security/hash.security.js";
import { generateLoginToken } from "../../utils/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../utils/Event/email.event.js";
import * as DBService from "../../DB/db.service.js";
import { nanoidValidation } from "./auth.validation.js";

// method to work in asyncHandler must have ## async (req , res ,next) ## .

// Signup and login System

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (await DBService.findOne({ model: UserModel, filter: { email } })) {
    return next(
      new Error("Email already exist", {
        // option
        cause: 409,
      }),
    );
  }
  const hashPassword = await generateHash({ plaintext: password });
  const encryptPhone = await encrypt({ plainText: phone });
  const otp = await nanoidValidation();
  const hashOtp = await generateHash({ plaintext: otp });
  const [user] = await DBService.create({
    model: UserModel,
    field: [
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        phone: encryptPhone,
        confirmEmailOtp: hashOtp,
        OtpCreatedAt: Date.now(),
      },
    ],
  });
  emailEvent.emit("sendConfirmEmail", {
    email,
    otp,
    user: {
      fullName: user.fullName,
    },
  });
  return successResponse({ res, status: 201, data: { user } });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.system },
  });
  if (!user) {
    return next(new Error("In_valid email or password", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(
      new Error("Your email address is not confirmed yet", { cause: 400 }),
    );
  }
  if (!(await comparHash({ plaintext: password, hashValue: user.password }))) {
    return next(new Error("In_valid email or password", { cause: 404 }));
  }
  const credentials = await generateLoginToken({ user });

  return successResponse({ res, data: { credentials } });
});

//  signup and login google

async function verify(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID, //.split(" "),
  });
  const payload = ticket.getPayload();
  return payload;
}

export const signupWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { email_verified, email, name } = await verify(idToken);
  if (!email_verified) {
    return next(new Error("Email not verified"));
  }
  const user = await DBService.findOne({ model: UserModel, filter: { email } });
  if (user) {
    return next(new Error("email already exist", { cause: 409 }));
  }
  const newUser = await DBService.create({
    model: UserModel,
    field: [
      {
        confirmEmail: Date.now(),
        fullName: name,
        email,
        provider: providerEnum.google,
      },
    ],
  });
  return successResponse({ res, status: 201, data: { newUser } });
});

export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  // const { email_verified, email } = await verify(idToken);
  const { email_verified, email, name } = await verify(idToken);
  if (!email_verified) {
    return next(new Error("Email not verified"));
  }
  let user = await DBService.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.google },
  });

  // if (!user) {
  //   return next(new Error("In-valid email or password", { cause: 401 }));
  // }

  if (!user) {
    const [newUser] = await DBService.create({
      model: UserModel,
      field: [
        {
          email,
          fullName: name,
          confirmEmail: Date.now(),
          provider: providerEnum.google,
        },
      ],
    });

    user = newUser;
  }

  const data = await generateLoginToken({ user });
  return successResponse({ res, data });
});

// Confirm Email

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      provider: providerEnum.system,
    },
  });

  if (!user) {
    return next(new Error("In_valid account 📧❌", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return next(new Error("you are already confirm 📨", { cause: 400 }));
  }
  if (!user.confirmEmailOtp) {
    return next(new Error("OTP not sent or expired 🔐", { cause: 400 }));
  }
  const now = Date.now();
  const otpExpiration = new Date(user.OtpCreatedAt).getTime() + 2 * 60 * 1000;
  if (now > otpExpiration) {
    return next(new Error("OTP has expired💀", { cause: 400 }));
  }
  if (
    !(await comparHash({ plaintext: otp, hashValue: user.confirmEmailOtp }))
  ) {
    return next(new Error("In-valid OTP 🔐⛔", { cause: 404 }));
  }
  await DBService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      $set: { confirmEmail: Date.now() },
      $unset: {
        confirmEmailOtp: 1,
        OtpCreatedAt: 1,
        block: 1,
      },
    },
  });
  return successResponse({ res, message: "confirm email successfully 💌" });
});

// Send New OTP

export const newOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      provider: providerEnum.system,
    },
  });

  if (!user) {
    return next(new Error("In_valid account 📧❌", { cause: 404 }));
  }

  if (user.confirmEmail) {
    return next(new Error("you are already confirm 📨", { cause: 400 }));
  }

  if (user.block && Date.now() > new Date(user.block).getTime()) {
    await DBService.updateOne({
      model: UserModel,
      filter: { email },
      data: {
        $unset: { block: "" },
        $set: { OTPCount: 0 },
      },
    });

    user.block = undefined;
    user.OTPCount = 0;
  }

  if (user.block && Date.now() < new Date(user.block).getTime()) {
    const minutesLeft = Math.ceil(
      (new Date(user.block).getTime() - Date.now()) / 60000,
    );
    return next(
      new Error(
        `Too many attempts 🚫. Try again after ${minutesLeft} minutes`,
        { cause: 429 },
      ),
    );
  }

  if (user.OTPCount >= 5) {
    await DBService.updateOne({
      model: UserModel,
      filter: { email },
      data: {
        $set: {
          block: new Date(Date.now() + 5 * 60 * 1000),
          OTPCount: 5,
        },
      },
    });
    return next(
      new Error("Too many OTP attempts 🚫. Try again after 5 minutes", {
        cause: 429,
      }),
    );
  }
  const otp = await nanoidValidation();
  const hashOtp = await generateHash({ plaintext: otp });

  await DBService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      $set: {
        confirmEmailOtp: hashOtp,
        OtpCreatedAt: Date.now(),
      },
      $inc: {
        OTPCount: 1,
      },
    },
  });

  emailEvent.emit("sendConfirmEmail", {
    email,
    otp,
    user: {
      fullName: user.fullName,
    },
  });

  return successResponse({ res, message: "OTP sent successfully 💌" });
});

// Send Forget Password

export const sendForgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = await nanoidValidation();
  const hashOTP = await generateHash({ plaintext: otp });
  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: {
      email,
      deletedAt: { $exists: false },
      confirmEmail: { $exists: true },
    },
    data: {
      $set: { forgetPassword: hashOTP },
    },
  });
  if (!user) {
    return next(new Error("in-valid Account", { cause: 404 }));
  }
  emailEvent.emit("forgetPassword", {
    email,
    otp,
    user: {
      fullName: user.fullName,
    },
  });
  return successResponse({ res, data: { user } });
});

// This step is not important

export const verifyForgetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      deletedAt: { $exists: false },
      confirmEmail: { $exists: true },
      forgetPassword: { $exists: true },
    },
  });
  if (!user) {
    return next(new Error("in-valid Account", { cause: 404 }));
  }
  if (!(await comparHash({ plaintext: otp, hashValue: user.forgetPassword }))) {
    return next(new Error("In-valid OTP 🔐⛔", { cause: 400 }));
  }
  return successResponse({ res, data: {} });
});

// reset password
export const resetForgetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password, confirmPassword } = req.body;
  const user = await DBService.findOne({
    model: UserModel,
    filter: {
      email,
      deletedAt: { $exists: false },
      confirmEmail: { $exists: true },
      forgetPassword: { $exists: true },
    },
  });
  if (!user) {
    return next(new Error("in-valid Account", { cause: 404 }));
  }
  if (!(await comparHash({ plaintext: otp, hashValue: user.forgetPassword }))) {
    return next(new Error("In-valid OTP 🔐⛔", { cause: 400 }));
  }
  const hashPassword = await generateHash({ plaintext: password });
  const resetPassData = await DBService.updateOne({
    model: UserModel,
    filter: {
      email,
    },
    data: {
      $set: {
        password: hashPassword,
        changeLoginCredentials: Date.now(),
      },
      $unset: { forgetPassword: 1 },
      $inc: { __v: 1 },
    },
  });
  return successResponse({ res, data: { resetPassData } });
});
