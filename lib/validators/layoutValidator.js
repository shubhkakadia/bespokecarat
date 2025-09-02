import Joi from "joi";

export const layoutValidator = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Layout name is required",
    "string.base": "Layout name must be a string",
  }),

  sku: Joi.string().required().messages({
    "any.required": "SKU is required",
    "string.base": "SKU must be a string",
  }),

  layout_type: Joi.string().allow(null, "").optional(),

  description: Joi.string().allow(null, "").optional(),

  is_available: Joi.boolean().required().messages({
    "any.required": "Availability is required",
    "boolean.base": "Availability must be true/false",
  }),

  price: Joi.number().required().messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
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

  diamond_details: Joi.array()
    .items(
      Joi.object({
        shape: Joi.string().required().messages({
          "any.required": "Diamond shape is required",
          "string.base": "Diamond shape must be a string",
        }),
        pcs: Joi.number().integer().required().messages({
          "any.required": "PCS is required",
          "number.base": "PCS must be a number",
        }),
        carat_weight: Joi.number().required().messages({
          "any.required": "Carat weight is required",
          "number.base": "Carat weight must be a number",
        }),
        dimension: Joi.string().required().messages({
          "any.required": "Dimension is required",
          "string.base": "Dimension must be a string",
        }),
        color_range: Joi.string().required().messages({
          "any.required": "Color range is required",
          "string.base": "Color range must be a string",
        }),
        clarity_range: Joi.string().required().messages({
          "any.required": "Clarity range is required",
          "string.base": "Clarity range must be a string",
        }),
      })
    )
    .default([])
    .messages({
      "array.base": "Diamond details must be an array",
    }),
});
