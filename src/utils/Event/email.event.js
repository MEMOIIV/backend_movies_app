import { EventEmitter } from 'events';
import { sendEmail } from "../email/send.email.js";
import { emailTemplate } from '../email/email.template.js';
export const emailEvent  = new EventEmitter();

emailEvent.on("sendConfirmEmail" , async({email , subject = "Confirm Email" , world ="Confirm", title="Use the OTP code below to complete your verification:", otp = "" , user}={})=>{
    const html = await emailTemplate({otp  , user , subject , title , world})
    await sendEmail({
    to: email,
    subject,
    html
  });
})
emailEvent.on("forgetPassword" , async({email , subject = "forget password", world ="reset", title = "Use the OTP code below to reset your password:" , otp = "" , user}={})=>{
    const html = await emailTemplate({otp  , user , subject , title , world})
    await sendEmail({
    to: email,
    subject,
    html
  });
})