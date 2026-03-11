// src/validators/programValidator.js

import Joi from "joi";

/**
 * ➕ Create Program Schema (Admin)
 */
export const createProgramSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(300)
    .required(),

  description: Joi.string()
    .trim()
    .min(20)
    .required(),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard")
    .required(),

  constraints_text: Joi.string()
    .allow("", null),

  time_limit_ms: Joi.number()
    .integer()
    .min(500)
    .max(10000)
    .default(2000),

  memory_limit_mb: Joi.number()
    .integer()
    .min(64)
    .max(2048)
    .default(256),

  supported_languages: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required(),

  public_testcase_count: Joi.number()
    .integer()
    .min(0)
    .default(0),

  private_testcase_count: Joi.number()
    .integer()
    .min(0)
    .default(0),
  publicTestcases: Joi.array().items(
  Joi.object({
    input: Joi.string().required(),
    output: Joi.string().required()
  })
).default([]),

privateTestcases: Joi.array().items(
  Joi.object({
    input: Joi.string().required(),
    output: Joi.string().required()
  })
).default([])
});


/**
 * ✏️ Update Program Schema (Admin)
 */
export const updateProgramSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(300),

  description: Joi.string()
    .trim()
    .min(20),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard"),

  constraints_text: Joi.string()
    .allow("", null),

  time_limit_ms: Joi.number()
    .integer()
    .min(500)
    .max(10000),

  memory_limit_mb: Joi.number()
    .integer()
    .min(64)
    .max(2048),

  supported_languages: Joi.array()
    .items(Joi.string().trim())
    .min(1),

  public_testcase_count: Joi.number()
    .integer()
    .min(0),

  private_testcase_count: Joi.number()
  .integer()
  .min(0)
}).min(1);


/**
 * 🔎 Program Query Filters (Pagination + Difficulty)
 */
export const programQuerySchema = Joi.object({
  difficulty: Joi.string().valid("easy", "medium", "hard"),

  page: Joi.number()
    .integer()
    .min(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
});