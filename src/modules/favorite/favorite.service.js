import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from "../../DB/db.service.js";
import { UserModel } from "../../DB/models/User.Model.js";
// ➕ add favorite
export const addFavorite = asyncHandler(async (req, res, next) => {
  const { mediaId, mediaType } = req.body;

  // تحقق هل موجود مسبقًا
  const user = await DBService.findOne({
    model: UserModel,
    filter: { _id: req.user._id },
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const exists = (user.favorites || []).find((f) => f.mediaId === mediaId);

  if (exists) {
    return next(new Error("Already in favorites", { cause: 409 }));
  }

  // إضافة
  const updateResult = await DBService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      $push: {
        favorites: { mediaId, mediaType },
      },
    },
  });

  return successResponse({
    res,
    message: "Added to favorites",
    data: { updateResult },
  });
});

// ❌ remove favorite
export const removeFavorite = asyncHandler(async (req, res, next) => {
  const { mediaId } = req.body;

  await DBService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      $pull: {
        favorites: { mediaId },
      },
    },
  });

  return successResponse({
    res,
    message: "success",
  });
});

// 📥 get favorites
export const getFavorites = asyncHandler(async (req, res, next) => {
  const user = await DBService.findOne({
    model: UserModel,
    filter: { _id: req.user._id },
    select: "favorites",
  });

  return successResponse({
    res,
    data: { favorites: user?.favorites || [] },
  });
});
