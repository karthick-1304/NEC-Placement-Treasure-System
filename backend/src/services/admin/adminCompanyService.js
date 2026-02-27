// src/services/admin/adminCompanyService.js

import AppError from "../../utils/appError.js";
import {
  getCompanyByName,
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../../queries/admin/adminCompanyQueries.js";

/**
 * ➕ Create Company
 */
export const createCompanyService = async (data, logo_url) => {
  const { company_name, location, is_active = true } = data;

  if (!company_name) {
    throw new AppError("Company name is required", 400);
  }

  // 1️⃣ Check duplicate
  const existing = await getCompanyByName(company_name);
  if (existing.length) {
    throw new AppError("Company with this name already exists", 400);
  }

  // 2️⃣ Insert
  const result = await createCompany(
    company_name,
    location,
    logo_url,
    is_active
  );

  return {
    message: "Company created successfully",
    companyId: result.insertId
  };
};

/**
 * 📄 Get All Companies
 */
export const getAllCompaniesService = async (filters) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  const companies = await getAllCompanies({
    offset,
    limit
  });

  return {
    page,
    limit,
    count: companies.length,
    data: companies
  };
};

/**
 * 🔍 Get Single Company
 */
export const getCompanyByIdService = async (companyId) => {
  const company = await getCompanyById(companyId);

  if (!company.length) {
    throw new AppError("Company not found", 404);
  }

  return company[0];
};

/**
 * ✏️ Update Company
 */
export const updateCompanyService = async (companyId, data, logo_url) => {
  const company = await getCompanyById(companyId);

  if (!company.length) {
    throw new AppError("Company not found", 404);
  }

  const fields = [];
  const values = [];

  if (data.company_name !== undefined) {
    fields.push("company_name = ?");
    values.push(data.company_name);
  }

  if (data.location !== undefined) {
    fields.push("location = ?");
    values.push(data.location);
  }

  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active);
  }

  if (logo_url) {
    fields.push("logo_url = ?");
    values.push(logo_url);
  }

  if (!fields.length) {
    throw new AppError("No fields provided for update", 400);
  }

  await updateCompany(companyId, fields.join(", "), values);

  return { message: "Company updated successfully" };
};

/**
 * ❌ Delete Company
 */
export const deleteCompanyService = async (companyId) => {
  const company = await getCompanyById(companyId);

  if (!company.length) {
    throw new AppError("Company not found", 404);
  }

  await deleteCompany(companyId);

  return { message: "Company deleted successfully" };
};