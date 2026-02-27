// src/validators/studentValidator.js

import Joi from "joi";

/**
 * 🔐 Strong Password Pattern
 * - Minimum 8 characters
 * - At least 1 uppercase
 * - At least 1 lowercase
 * - At least 1 number
 * - At least 1 special character
 */
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * 🎓 Create Student Schema (Admin Only)
 * Based on:
 * users + student_profiles
 */
export const createStudentSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(passwordPattern)
    .message(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    )
    .required(),

  // student_profiles fields
  reg_no: Joi.string().trim().min(5).max(20).required(),

  dept_id: Joi.number().integer().positive().required(),

  batch_year: Joi.number().integer().min(2000).max(2100).required()
});


/**
 * 📝 Update Student Schema (Admin)
 */
export const updateStudentSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100),

  email: Joi.string().email(),

  reg_no: Joi.string().trim().min(5).max(20),

  dept_id: Joi.number().integer().positive(),

  batch_year: Joi.number().integer().min(2000).max(2100),

  is_blacklisted: Joi.boolean()
}).min(1); // At least one field must be provided


/**
 * 🔍 Student Query Filters (Admin Panel)
 */
export const studentQuerySchema = Joi.object({
  dept_id: Joi.number().integer().positive(),

  batch_year: Joi.number().integer().min(2000).max(2100),

  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1).max(100)
});