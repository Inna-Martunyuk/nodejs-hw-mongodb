import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be empty`,
    "string.min": `"name" should have at least {#limit} characters`,
    "string.max": `"name" should have at most {#limit} characters`,
    "any.required": `"name" is required`,
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    "string.base": `"phoneNumber" should be a type of 'text'`,
    "string.empty": `"phoneNumber" cannot be empty`,
    "string.min": `"phoneNumber" should have at least {#limit} characters`,
    "string.max": `"phoneNumber" should have at most {#limit} characters`,
    "any.required": `"phoneNumber" is required`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be empty`,
    "any.required": `"email" is required`,
  }),
  isFavourite: Joi.boolean().required().messages({
    "boolean.base": `"isFavourite" must be a boolean`,
    "any.required": `"isFavourite" is required`,
  }),
  contactType: Joi.string().min(3).max(20).required().messages({
    "string.base": `"contactType" should be a type of 'text'`,
    "string.empty": `"contactType" cannot be empty`,
    "string.min": `"contactType" should have at least {#limit} characters`,
    "string.max": `"contactType" should have at most {#limit} characters`,
    "any.required": `"contactType" is required`,
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be empty`,
    "string.min": `"name" should have at least {#limit} characters`,
    "string.max": `"name" should have at most {#limit} characters`,
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    "string.base": `"phoneNumber" should be a type of 'text'`,
    "string.empty": `"phoneNumber" cannot be empty`,
    "string.min": `"phoneNumber" should have at least {#limit} characters`,
    "string.max": `"phoneNumber" should have at most {#limit} characters`,
  }),
  email: Joi.string().email().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email address`,
    "string.empty": `"email" cannot be empty`,
  }),
  isFavourite: Joi.boolean().messages({
    "boolean.base": `"isFavourite" must be a boolean`,
  }),
  contactType: Joi.string().min(3).max(20).messages({
    "string.base": `"contactType" should be a type of 'text'`,
    "string.empty": `"contactType" cannot be empty`,
    "string.min": `"contactType" should have at least {#limit} characters`,
    "string.max": `"contactType" should have at most {#limit} characters`,
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
