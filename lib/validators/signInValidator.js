import Joi from "joi";

export const signInValidator = Joi.object({
  email_or_phone: Joi.string().required().messages({
    "string.empty": "Email or phone is required",
  }),
  password: Joi.string().min(8).max(16).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password too long",
    "any.required": "Password is required",
  }),
});
