import { Types } from "mongoose";
import { asyncHandler } from "../utils/response.js";
import Joi from "joi";
import { genderEnum } from "../DB/models/User.Model.js";

export const generalFields = {
  fullName: Joi.string().min(2).max(20).case("lower").messages({
    "string.min": "min fullName length is 2 char",
    "string.max": "max fullName length is 20 char",
    "any.required": "fullName is mandatory !!",
  }),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(
    new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ),
  confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Confirm password must match password",
  }),
  phone: Joi.string().pattern(
    new RegExp(/^(?:\+20|0020)(1[0125]\d{8})$|^(01[0125]\d{8})$/)
  ),
  otp: Joi.string().pattern(new RegExp(/^\d{6}$/)),
  idToken: Joi.string(),
  idMongoDB: Joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value)
      ? true
      : helper.message("In-valid mongoDB ID");
  }),
  gender: Joi.string().valid(...Object.values(genderEnum)),
  file: {
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    finalPath: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().positive().required(),
  },
};

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    // console.log(schema);
    // console.log(Object.keys(schema));
    const validationError = [];
    for (const kye of Object.keys(schema)) {
      // we used here for og because if we updated validate form validate to validateAsync ## for of waiting async ## not like for each
      const validationResult = schema[kye].validate(req[kye], {
        abortEarly: false,
      }); // if return with key error i have error   // {abortEarly:false} => default true => true mean => Return when you discover the first error
      if (validationResult.error) {
        validationError.push(validationResult.error?.details);
      }
    }
    if (validationError.length) {
      //  return next(new Error(validationError)) // return => [object object , object object] 😂😂
      return res.status(400).json({
        error_message: "validation error",
        error: validationError,
      });
    }
    return next();
  });
};

// export const validationBody = (schema)=>{
//      return asyncHandler(async (req, res, next) => {
//   const validationResult = schema.validate(req.body, {
//     abortEarly: false,
//   }); // if return with key error i have error   // {abortEarly:false} => default true => true mean => Return when you discover the first error
//   if (validationResult.error) {
//     return successResponse({ res, data: { validationResult } });
//   }
//   return next()
// });
// }

// export const validationQuery = (schema)=>{
//      return asyncHandler(async (req, res, next) => {
//   const validationResult = schema.validate(req.query, {
//     abortEarly: false,
//   }); // if return with key error i have error   // {abortEarly:false} => default true => true mean => Return when you discover the first error
//   if (validationResult.error) {
//     return successResponse({ res, data: { validationResult } });
//   }
//   return next()
// });
// }
