import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { fileValidators } from "../../utils/multer/local.multer.js";
export const shearProfile = {
  params: Joi.object()
    .keys({
      profileId: generalFields.idMongoDB.required(),
    })
    .required(),
};

export const updateBasicProfile = {
  body: Joi.object()
    .keys({
      firstName: generalFields.fullName,
      lastName: generalFields.fullName,
      phone: generalFields.phone,
      gender: generalFields.gender,
    })
    .required(),
};

export const freezeAccount = {
  body: Joi.object().keys({
    userId: generalFields.idMongoDB,
  }),
};

export const restoreAccount = {
  body: Joi.object().keys({
    userId: generalFields.idMongoDB,
  }),
};

export const hardDelete = freezeAccount;

export const updatePassword = {
  body: Joi.object().keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password
      .required()
      .invalid(Joi.ref("oldPassword"))
      .messages({
        "any.required": "Password is required",
        "any.invalid": "New password must not be the same as the old password",
      }),
    confirmPassword: generalFields.confirmPassword.required(),
  }),
};

export const uploadFile = {
  file: Joi.object().keys({
    fieldname: generalFields.file.fieldname.valid("attachments").required(),
    originalname: generalFields.file.originalname.required(),
    encoding: generalFields.file.encoding.required(),
    mimetype: generalFields.file.mimetype.valid(...fileValidators.image).required(),
    // finalPath: generalFields.file.finalPath.required(),
    destination: generalFields.file.destination.required(),
    filename: generalFields.file.filename.required(),
    path: generalFields.file.path.required(),
    size: generalFields.file.size.required(),
  }),
};

export const uploadManyFile = {
  files: Joi.array().items(
    Joi.object().keys({
      fieldname: generalFields.file.fieldname.valid("attachments").required(),
      originalname: generalFields.file.originalname.required(),
      encoding: generalFields.file.encoding.required(),
      mimetype: generalFields.file.mimetype.valid(...fileValidators.image).required(),
      // finalPath: generalFields.file.finalPath.required(),
      destination: generalFields.file.destination.required(),
      filename: generalFields.file.filename.required(),
      path: generalFields.file.path.required(),
      size: generalFields.file.size.required(),
    }).required()
  ).min(1).max(2).required()
};
