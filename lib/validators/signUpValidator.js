import Joi from "joi";

export const signUpValidator = Joi.object({
  first_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters",
  }),
  last_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),
  phone_number: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 15 digits",
    }),
  company_name: Joi.string().allow("").optional(),
  password: Joi.string().min(8).max(16).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password too long",
    "any.required": "Password is required",
  }),
  accepted_terms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the terms and conditions",
  }),
  newsletter: Joi.boolean().required(),
});
