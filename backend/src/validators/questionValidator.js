// src/validators/questionValidator.js

import Joi from "joi";
import { DIFFICULTY_LIST } from "../constants/difficultyLevels.js";

/**
 * 🧠 Create Coding Question Schema (Admin)
 */
export const createQuestionSchema = Joi.object({
  company_id: Joi.number().integer().positive().required(),

  title: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required(),

  description: Joi.string()
    .trim()
    .min(20)
    .required(),

  difficulty: Joi.string()
    .valid(...DIFFICULTY_LIST)
    .required(),

  year_asked: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 1)
    .required(),

  sample_input: Joi.string()
    .allow("", null),

  sample_output: Joi.string()
    .allow("", null),

  constraints: Joi.string()
    .allow("", null),

  is_active: Joi.boolean().optional()
});

/**
 * ✏️ Update Coding Question Schema (Admin)
 */
export const updateQuestionSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(200),

  description: Joi.string()
    .trim()
    .min(20),

  difficulty: Joi.string()
    .valid(...DIFFICULTY_LIST),

  year_asked: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 1),

  sample_input: Joi.string()
    .allow("", null),

  sample_output: Joi.string()
    .allow("", null),

  constraints: Joi.string()
    .allow("", null),

  is_active: Joi.boolean()
}).min(1);

/**
 * 🔎 Question Query Filters (Admin / Student)
 */
export const questionQuerySchema = Joi.object({
  company_id: Joi.number().integer().positive(),

  difficulty: Joi.string().valid(...DIFFICULTY_LIST),

  year_asked: Joi.number().integer(),

  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1).max(100)
});