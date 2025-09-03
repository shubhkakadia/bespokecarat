import Joi from "joi";

export const colorStoneValidator = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Color stone name is required",
    "string.base": "Color stone name must be a string",
  }),

  color: Joi.string().required().messages({
    "any.required": "Color is required",
    "string.base": "Color must be a string",
  }),

  sku: Joi.string().required().messages({
    "any.required": "SKU is required",
    "string.base": "SKU must be a string",
  }),

  certification: Joi.string().allow(null, "").optional(),

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

  color_stone_variants: Joi.array()
    .items(
      Joi.object({
        shape: Joi.string().required().messages({
          "any.required": "Variant shape is required",
          "string.base": "Variant shape must be a string",
        }),
        dimension: Joi.string().required().messages({
          "any.required": "Variant dimension is required",
          "string.base": "Variant dimension must be a string",
        }),
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
      "array.base": "Color stone variants must be an array",
    }),
});
