// src/queries/admin/adminCompanyQueries.js

import { query } from "../../utils/db.js";

/**
 * 🔎 Get Company By Name
 */
export const getCompanyByName = async (company_name) => {
  return await query(
    `SELECT company_id 
     FROM companies 
     WHERE company_name = ?`,
    [company_name]
  );
};

/**
 * ➕ Create Company
 */
export const createCompany = async (
  company_name,
  location,
  logo_url,
  is_active = true
) => {
  return await query(
    `INSERT INTO companies
      (company_name, location, logo_url, is_active)
     VALUES (?, ?, ?, ?)`,
    [company_name, location, logo_url, is_active]
  );
};

/**
 * 📄 Get All Companies (Pagination Only)
 */
export const getAllCompanies = async ({ offset = 0, limit = 10 }) => {
  const sql = `
    SELECT
      company_id,
      company_name,
      location,
      logo_url,
      is_active,
      created_at,
      updated_at
    FROM companies
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  return await query(sql, [limit, offset]);
};

/**
 * 🔍 Get Company By ID
 */
export const getCompanyById = async (companyId) => {
  return await query(
    `SELECT
      company_id,
      company_name,
      location,
      logo_url,
      is_active,
      created_at,
      updated_at
     FROM companies
     WHERE company_id = ?`,
    [companyId]
  );
};

/**
 * ✏️ Update Company
 */
export const updateCompany = async (companyId, fields, values) => {
  const sql = `
    UPDATE companies
    SET ${fields}
    WHERE company_id = ?
  `;

  return await query(sql, [...values, companyId]);
};

/**
 * ❌ Delete Company
 */
export const deleteCompany = async (companyId) => {
  return await query(
    `DELETE FROM companies 
     WHERE company_id = ?`,
    [companyId]
  );
};