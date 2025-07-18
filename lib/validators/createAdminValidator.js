import Joi from "joi";

export const adminCreateValidator = Joi.object({
  first_name: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 1 character",
    "string.max": "First name must be at most 50 characters",
  }),
  last_name: Joi.string().trim().min(1).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 1 character",
    "string.max": "Last name must be at most 50 characters",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 20 characters",
    "string.empty": "Password is required",
  }),
  is_master: Joi.boolean().required().messages({
    "any.required": "is_master flag is required",
  }),
});
