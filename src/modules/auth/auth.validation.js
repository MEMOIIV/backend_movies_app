import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { customAlphabet } from "nanoid"; // nanoid() or customAlphabet( 123456789 or 123456abcdef , 6 )()

// export  const signupBody = Joi.object().keys({
//   fullName : Joi.string().min(2).max(20).case("lower").required().messages({
//     "string.min" : "min fullName length is 2 char",
//     "string.max" : "max fullName length is 20 char",
//     "any.required" : "fullName is mandatory !!",
//   }) ,
//   email : Joi.string().email({minDomainSegments:2 , maxDomainSegments:3 , tlds:{allow:["com" , "net"]}}).required(),
//   password : Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
//   confirmPassword : Joi.string().valid(Joi.ref("password")).required(),
//   phone : Joi.string().pattern(new RegExp(/^(?:\+20|0020)(1[0125]\d{8})$|^(01[0125]\d{8})$/)).required(),
// }).required() //.options({allowUnKnown: true}) => allow any field go without validation

// export  const signupQuery = Joi.object().keys({
//   lang : Joi.string().valid("ar" , "en")
// }).required()

export const signup = {
  body: Joi.object()
    .keys({
      firstName: generalFields.fullName.required(),
      lastName: generalFields.fullName.required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword.required(),
      phone: generalFields.phone,
    })
    .required(), //.options({allowUnKnown: true}) => allow any field go without validation
};

export const login = {
  body: Joi.object()
    .keys({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required(),
};

export const confirmEmail = {
  body: Joi.object()
    .keys({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
    })
    .required(),
};

export const signupWithGmail = {
  body: Joi.object()
    .keys({
      idToken: generalFields.idToken.required(),
    })
    .required(),
};

export const sendForgetPassword = {
  body: Joi.object()
    .keys({
      email: generalFields.email.required(),
    })
    .required(),
};

export const verifyForgetPassword = {
  body: Joi.object()
    .keys({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
    })
    .required(),
};

export const resetForgetPassword = {
  body: Joi.object()
    .keys({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword.required(),
    })
    .required(),
};



// nanoId 

export const nanoidValidation = async ({
  match = "0123456789",
  num = 6,
} = {}) => {
  return customAlphabet(match, num)();
};