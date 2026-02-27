// src/validators/feedbackValidator.js

import Joi from "joi";

/**
 * 📝 Create Feedback Schema (Student)
 */
export const createFeedbackSchema = Joi.object({
  company_id: Joi.number().integer().positive().required(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  message: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required(),

  interview_year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 1)
    .required()
});

/**
 * ✏️ Update Feedback Schema (Admin / Student)
 */
export const updateFeedbackSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5),

  message: Joi.string()
    .trim()
    .min(10)
    .max(1000),

  is_approved: Joi.boolean()
}).min(1);

/**
 * 🔎 Feedback Query Filters (Admin)
 */
export const feedbackQuerySchema = Joi.object({
  company_id: Joi.number().integer().positive(),

  rating: Joi.number().integer().min(1).max(5),

  interview_year: Joi.number().integer(),

  is_approved: Joi.boolean(),

  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1).max(100)
});