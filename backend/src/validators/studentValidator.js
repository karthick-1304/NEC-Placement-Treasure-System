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

  register_number: Joi.string().trim().min(5).max(20).required(),

  department_id: Joi.number().integer().positive().required(),

  year: Joi.number().integer().min(1).max(5).required(),

  cgpa: Joi.number().min(0).max(10).precision(2).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone number must be 10 digits.")
    .required()
});

/**
 * 📝 Update Student Schema (Admin)
 */
export const updateStudentSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100),

  email: Joi.string().email(),

  register_number: Joi.string().trim().min(5).max(20),

  department_id: Joi.number().integer().positive(),

  year: Joi.number().integer().min(1).max(5),

  cgpa: Joi.number().min(0).max(10).precision(2),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("Phone number must be 10 digits."),

  is_blacklisted: Joi.boolean()
}).min(1); // At least one field must be provided

/**
 * 🔍 Student Query Filters (Admin Panel)
 */
export const studentQuerySchema = Joi.object({
  department_id: Joi.number().integer().positive(),

  year: Joi.number().integer().min(1).max(5),

  min_cgpa: Joi.number().min(0).max(10),

  max_cgpa: Joi.number().min(0).max(10),

  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1).max(100)
});