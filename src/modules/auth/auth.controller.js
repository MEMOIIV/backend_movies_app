import { validation } from "../../middleware/validation.middleware.js";
import * as authService from "./auth.service.js"
import * as authValidation from "./auth.validation.js"
import { Router } from "express";
const router = Router({caseSensitive:true ,strict:true})

    router.post("/signup" , validation(authValidation.signup), authService.signup)
    router.post("/signup/gmail" , validation(authValidation.signupWithGmail),authService.signupWithGmail)

    router.patch("/confirm-email" , validation(authValidation.confirmEmail), authService.confirmEmail)
    router.patch("/new-otp" , authService.newOTP)

    router.post("/login" , validation(authValidation.login),validation(authValidation.login),authService.login)
    router.post("/login/gmail" , validation(authValidation.signupWithGmail) , authService.loginWithGmail)

    router.patch("/send-forget-password",validation(authValidation.sendForgetPassword) , authService.sendForgetPassword)
    router.patch("/verify-forget-password",validation(authValidation.verifyForgetPassword) , authService.verifyForgetPassword)
    router.patch("/reset-forget-password",validation(authValidation.resetForgetPassword) , authService.resetForgetPassword)
export default router;