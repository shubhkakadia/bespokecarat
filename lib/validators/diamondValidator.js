import Joi from "joi";

export const diamondValidator = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Diamond name is required",
    "string.base": "Diamond name must be a string",
  }),

  shape: Joi.string().required().messages({
    "any.required": "Shape is required",
    "string.base": "Shape must be a string",
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

  images: Joi.array().items(Joi.any()).optional().messages({
    "array.base": "Images must be an array",
  }),

  videos: Joi.array().optional().default([]).messages({
    "array.base": "Videos must be an array",
  }),

  diamond_variants: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().required().messages({
          "any.required": "Variant color is required",
          "string.base": "Variant color must be a string",
        }),
        clarity: Joi.string().required().messages({
          "any.required": "Variant clarity is required",
          "string.base": "Variant clarity must be a string",
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
      "array.base": "Diamond variants must be an array",
    }),
});
