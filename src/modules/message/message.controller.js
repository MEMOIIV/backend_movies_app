import { Router } from "express";
import { fileValidators } from "../../utils/multer/local.multer.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import* as validators from './message.validation.js'
import* as messageService from './message.service.js'

const router = Router({caseSensitive:true ,strict:true})
router.post("/:receiverId" ,cloudFileUpload({fileValidation:fileValidators.image}).array("attachments" , 2),validation(validators.sendMessages),messageService.sendMessage)

router.get("/get-message/:messageId" ,authentication(), messageService.getMessageById)
router.delete("/:messageId/freeze" , authentication() ,messageService.freezeAccount)
router.delete("/:messageId/delete" , authentication() ,messageService.hardDeleted)
export default router