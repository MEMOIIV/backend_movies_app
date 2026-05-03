import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as favoriteService from "./favorite.service.js";
import * as favoriteValidation from "./favorite.validation.js";
import { authentication } from "../../middleware/authentication.middleware.js";

const router = Router({ caseSensitive: true, strict: true });

// ➕ add favorite
router.post(
  "/add",
  authentication(),
  validation(favoriteValidation.addFavorite),
  favoriteService.addFavorite,
);

// ❌ remove favorite
router.delete(
  "/delete",
  authentication(),
  validation(favoriteValidation.removeFavorite),
  favoriteService.removeFavorite,
);

// 📥 get favorites
router.get("/all", authentication(), favoriteService.getFavorites);

export default router;
