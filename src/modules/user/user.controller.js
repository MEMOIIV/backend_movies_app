import {auth,authentication,} from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import { endPoint } from "./authorization.user.js";
import { validation } from "../../middleware/validation.middleware.js";
import { Router } from "express";
// import {fileValidators,localFileUpload,} from "../../utils/multer/local.multer.js";
import { cloudFileUpload, fileValidators } from "../../utils/multer/cloud.multer.js";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js";
const router = Router({caseSensitive:true ,strict:true})

router.get("/", auth({ accessRole: endPoint.profile }), userService.profile);
router.get("/public", userService.allProfile);

router.get(
  "/:profileId/sheared-profile",
  validation(userValidation.shearProfile),
  userService.shearProfile
);

router.get(
  "/refresh-token",
  authentication({ tokenType: tokenTypeEnum.refresh }),
  userService.refreshToken
);

router.patch(
  "/update-profile",
  authentication(),
  validation(userValidation.updateBasicProfile),
  userService.updateBasicProfile
);

router.patch(
  "/update-pass",
  authentication(),
  validation(userValidation.updatePassword),
  userService.updatePassword
);

// "/:userId?/delete-account" => Not supported in Express 5
// The solution is to separate the paths if the processing is completely different.
// or
// {/:userId} It is used when the difference is only slight (for example, if the ID is present, we do something extra)
router.delete(
  "{/:userId}/delete-account",
  authentication(),
  validation(userValidation.freezeAccount),
  userService.freezeAccount
);

router.patch(
  "{/:userId}/restore-account",
  authentication(),
  validation(userValidation.restoreAccount),
  userService.restoreAccount
);

router.delete(
  "{/:userId}/hard-delete",
  authentication(),
  validation(userValidation.hardDelete),
  userService.hardDeleted
);

router.post("/logout", authentication(), userService.logout);

// uploadOneFile
router.patch(
  "/upload-file",
  authentication(),
  cloudFileUpload({fileValidation: fileValidators.image,}).single("attachments"), // single mean upload just one file("attachment") // array to upload meany files("attachment", 2 /* max value 2 */) // fields to upload [{name : "profileImage" , maxCount : 1}, maxCount by default undefined no limit{name : "coverImage" , maxCount : 3}] // any(array) // nonevalidation(userValidation.uploadFile),
  userService.uploadOneFile
);
// uploadManyFiles
router.patch(
  "/upload-many-files",
  authentication(),
  cloudFileUpload({fileValidation: fileValidators.image,}).array("attachments",2),
  validation(userValidation.uploadManyFile),
  userService.uploadManyFile
);
export default router;
