import Joi from "joi";

export const meleeValidator = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Melee name is required",
    "string.base": "Melee name must be a string",
  }),

  shape: Joi.string().required().messages({
    "any.required": "Shape is required",
    "string.base": "Shape must be a string",
  }),

  sku: Joi.string().required().messages({
    "any.required": "SKU is required",
    "string.base": "SKU must be a string",
  }),

  description: Joi.string().allow(null, "").optional(),

  is_available: Joi.boolean().required().messages({
    "any.required": "Availability is required",
    "boolean.base": "Availability must be true/false",
  }),

  images: Joi.array().items(Joi.any()).optional().messages({
    "array.base": "Images must be an array",
  }),

  videos: Joi.array().optional().default([]).messages({
    "array.base": "Videos must be an array",
  }),

  sieve_sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().required().messages({
          "any.required": "Size is required",
          "string.base": "Size must be a string",
        }),
        color_range: Joi.string().required().messages({
          "any.required": "Color range is required",
          "string.base": "Color range must be a string",
        }),
        clarity_range: Joi.string().required().messages({
          "any.required": "Clarity range is required",
          "string.base": "Clarity range must be a string",
        }),
        price_per_carat: Joi.string().required().messages({
          "any.required": "Price per carat is required",
          "string.base": "Price per carat must be a string",
        }),
      })
    )
    .default([])
    .messages({
      "array.base": "Sieve sizes must be an array",
    }),
});
