import { asyncHandler, successResponse } from "../../utils/response.js";
import { UserModel } from "../../DB/models/User.Model.js";
import * as DBService from "../../DB/db.service.js";
import MessageModel from "../../DB/models/Message.model.js";
import {deleteFolderByPrefix,uploadFiles,} from "../../utils/multer/cloudinary.js";

// Send Message
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const checkUserExists = await DBService.findOne({
    model: UserModel,
    filter: {
      _id: receiverId,
      deletedAt: { $exists: false },
      confirmEmail: { $exists: true },
    },
  });
  if (!checkUserExists) {
    return next(new Error("in-valid receiverId"));
  }
  let attachments = [];
  let { content } = req.body;
  if (req.files?.length) {
    attachments = await uploadFiles({
      files: req.files,
      path: `messages/${receiverId}`,
    });
  }
  const messages = await DBService.create({
    model: MessageModel,
    field: [
      {
        content,
        attachments,
        receivedBy: receiverId,
      },
    ],
  });
  return successResponse({
    res,
    status: 201,
    message: "send message success",
    data: { messages },
  });
});

// Get Message By ID
export const getMessageById = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const message = await DBService.findOne({
    model: MessageModel,
    filter: { _id: messageId, deletedAt: { $exists: false } },
    select: "-_id content attachments receivedBy ",
  });
  if (!message) {
    return next(
      new Error("in-valid messageId or this message is deleted", { cause: 404 })
    );
  }
  // 🔴 check if this user authorized to access this message or not 🔴 \\
  /*  I put this if condition here 
      because I want to separate the existence check from the authorization check, 
      so I can return a 404 if the message doesn’t exist and a 403 if the user isn’t allowed to access it
  */
  if (message.receivedBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("you are not authorized to access this message", { cause: 403 })
    );
  }
  return successResponse({
    res,
    message: "find message success",
    data: message,
  });
});

// Frozen Message Before Hard Delete
export const freezeAccount = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const checkMessageExists = await DBService.findOne({
    model: MessageModel,
    filter: {
      _id: messageId,
      deletedAt: { $exists: false },
    },
  });
  if (!checkMessageExists) {
    return next(new Error("in-valid messageId", { cause: 404 }));
  }
  if (checkMessageExists.receivedBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("you are not authorized to frozen this message", { cause: 403 })
    );
  }
  const message = await DBService.updateOne({
    model: MessageModel,
    filter: {
      _id: messageId,
      deletedAt: { $exists: false },
    },
    data: {
      $set: {
        deletedAt: Date.now(),
        deletedBy: checkMessageExists.receivedBy,
      },
      $inc: { __v: 1 },
    },
  });
  return message.matchedCount
    ? successResponse({
        res,
        data: { message },
        message: "deleted message successfully",
      })
    : next(new Error("this message already deleted", { cause: 404 }));
});

// Hard Delete The Message
export const hardDeleted = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  const checkMessageExists = await DBService.findById({
    model: MessageModel,
    id: messageId,
  });

  if (!checkMessageExists) {
    return next(new Error("in-valid messageId", { cause: 404 }));
  }
  if (checkMessageExists.receivedBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("you are not authorized to deleted this message", { cause: 403 })
    );
  }
  // 🔴 check message frozen before hard deleted 🔴 \\
  if (!checkMessageExists.deletedAt) {
    return next(
      new Error("Message must be frozen before hard delete", { cause: 400 })
    );
  }

  const message = await DBService.deleteOne({
    model: MessageModel,
    filter: { _id: messageId, deletedAt: { $exists: true } },
  });

  // 🔴 delete file form cloudinary 🔴 \\
  if (message.deletedCount) {
    await deleteFolderByPrefix({
      prefix: `messages/${checkMessageExists.receivedBy.toString()}`,
    });
  }

  return message.deletedCount
    ? successResponse({
        res,
        data: { message },
        message: "deleted message successfully",
      })
    : next(new Error("this message already deleted", { cause: 404 }));
});
