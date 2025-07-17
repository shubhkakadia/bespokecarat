import Joi from "joi";

export const signInValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(16).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password too long",
    "any.required": "Password is required",
  }),
});
