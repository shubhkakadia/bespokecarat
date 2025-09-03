import Joi from "joi";

export const cutValidator = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),

  shape: Joi.string().required().messages({
    "string.base": "Shape must be a string",
    "any.required": "Shape is required",
  }),

  sku: Joi.string().required().messages({
    "string.base": "SKU must be a string",
    "any.required": "SKU is required",
  }),

  cut_type: Joi.string().allow(null, "").messages({
    "string.base": "Cut type must be a string",
  }),

  color_range: Joi.string().allow(null, "").messages({
    "string.base": "Color range must be a string",
  }),

  clarity_range: Joi.string().allow(null, "").messages({
    "string.base": "Clarity range must be a string",
  }),

  description: Joi.string().allow(null, "").messages({
    "string.base": "Description must be text",
  }),

  is_available: Joi.boolean().required().messages({
    "boolean.base": "Availability must be true or false",
    "any.required": "Availability is required",
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

  cut_variants: Joi.array()
    .items(
      Joi.object({
        dimension: Joi.string().required().messages({
          "string.base": "Dimension must be a string",
          "any.required": "Dimension is required",
        }),

        carat_weight: Joi.number().required().messages({
          "number.base": "Carat weight must be a number",
          "any.required": "Carat weight is required",
        }),

        price: Joi.number().required().messages({
          "number.base": "Price must be a number",
          "any.required": "Price is required",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Variants must be an array",
    }),
});
