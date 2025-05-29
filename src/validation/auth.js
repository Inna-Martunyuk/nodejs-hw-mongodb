import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be empty`,
    "string.min": `"name" should have at least {#limit} characters`,
    "string.max": `"name" should have at most {#limit} characters`,
    "any.required": `"name" is required`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be empty`,
    "any.required": `"email" is required`,
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$"))
    .required()
    .messages({
      "string.base": `"password" should be a type of 'text'`,
      "string.empty": `"password" cannot be empty`,
      "string.min": `"password" should have at least {#limit} characters`,
      "string.max": `"password" should have at most {#limit} characters`,
      "string.pattern.base": `"password" must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)`,
      "any.required": `"password" is required`,
    }),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be empty`,
    "any.required": `"email" is required`,
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$"))
    .required()
    .messages({
      "string.base": `"password" should be a type of 'text'`,
      "string.empty": `"password" cannot be empty`,
      "string.min": `"password" should have at least {#limit} characters`,
      "string.max": `"password" should have at most {#limit} characters`,
      "string.pattern.base": `"password" must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)`,
      "any.required": `"password" is required`,
    }),
});
