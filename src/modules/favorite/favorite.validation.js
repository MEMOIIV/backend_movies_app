import Joi from "joi";

export const addFavorite = {
  body: Joi.object({
    mediaId: Joi.string().required(),
    mediaType: Joi.string().valid("movie", "tv").required(),
  }).required(),
};

export const removeFavorite = {
  body: Joi.object({
    mediaId: Joi.string().required(),
  }).required(),
};
