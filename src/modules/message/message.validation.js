import Joi  from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { fileValidators } from "../../utils/multer/local.multer.js";
export const sendMessages = {
  params: Joi.object()
    .keys({
      receiverId: generalFields.idMongoDB.required(),
    }).required(),

  body: Joi.object().keys({
    content: Joi.string().min(2).max(500),
  }),

  files: Joi.array().items(
    Joi.object().keys({
      fieldname: generalFields.file.fieldname.valid('attachments'),
      originalname: generalFields.file.originalname,
      encoding: generalFields.file.encoding,
      mimetype: generalFields.file.mimetype.valid(...Object.values(fileValidators.image)),
      // finalPath: generalFields.file.finalPath,
      destination: generalFields.file.destination,
      filename: generalFields.file.filename,
      path: generalFields.file.path,
      size: generalFields.file.size,
    })
  ).max(2),
};
