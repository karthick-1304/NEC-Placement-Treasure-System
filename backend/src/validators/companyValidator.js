// src/validators/companyValidator.js

import Joi from "joi";

/**
 * 🏢 Create Company Schema (Admin)
 */
export const createCompanySchema = Joi.object({
  company_name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required(),

  location: Joi.string()
    .trim()
    .max(200)
    .allow(null, "")
    .optional(),

  is_active: Joi.boolean().optional()
});

/**
 * 📝 Update Company Schema (Admin)
 */
export const updateCompanySchema = Joi.object({
  company_name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .optional(),

  location: Joi.string()
    .trim()
    .max(200)
    .optional(),

  is_active: Joi.boolean().optional()
}).min(1);

/**
 * 🔍 Company Query Filters (Pagination Only)
 */
export const companyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),

  limit: Joi.number().integer().min(1).max(100).optional()
});