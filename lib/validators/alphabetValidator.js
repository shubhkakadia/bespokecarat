import Joi from "joi";

export const alphabetValidator = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Alphabet name is required",
    "string.base": "Alphabet name must be a string",
  }),

  sku: Joi.string().required().messages({
    "any.required": "SKU is required",
    "string.base": "SKU must be a string",
  }),

  character: Joi.string().max(1).required().messages({
    "any.required": "Character is required",
    "string.base": "Character must be a string",
    "string.max": "Character must be a single letter",
  }),

  color_range: Joi.string().required().messages({
    "any.required": "Color range is required",
    "string.base": "Color range must be a string",
  }),

  clarity_range: Joi.string().required().messages({
    "any.required": "Clarity range is required",
    "string.base": "Clarity range must be a string",
  }),

  description: Joi.string().allow(null, "").optional(),

  is_available: Joi.boolean().required().messages({
    "any.required": "Availability is required",
    "boolean.base": "Availability must be true/false",
  }),

  images: Joi.array().min(1).required().messages({
    "any.required": "At least one image is required",
    "array.base": "Images must be an array",
    "array.min": "At least one image is required",
  }),

  videos: Joi.array().min(1).required().messages({
    "any.required": "At least one video is required",
    "array.base": "Videos must be an array",
    "array.min": "At least one video is required",
  }),

  alphabet_variants: Joi.array()
    .items(
      Joi.object({
        carat_weight: Joi.number().required().messages({
          "any.required": "Carat weight is required",
          "number.base": "Carat weight must be a number",
        }),
        price: Joi.number().required().messages({
          "any.required": "Price is required",
          "number.base": "Price must be a number",
        }),
      })
    )
    .default([])
    .messages({
      "array.base": "Alphabet variants must be an array",
    }),
});
