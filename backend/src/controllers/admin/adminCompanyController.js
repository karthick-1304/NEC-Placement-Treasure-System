// src/controllers/admin/adminCompanyController.js


import catchAsync from "../../utils/catchAsync.js";
import {
  createCompanyService,
  getAllCompaniesService,
  getCompanyByIdService,
  updateCompanyService,
  deleteCompanyService
} from "../../services/admin/adminCompanyService.js";

/**
 * ➕ Create Company
 */
export const createCompany = catchAsync(async (req, res) => {
  const { company_name, location, is_active } = req.body;

  if (!company_name) {
    return res.status(400).json({
      status: "error",
      message: "Company name is required"
    });
  }

  const logo_url = req.file ? req.file.path : null;

  const result = await createCompanyService(
    {
      company_name,
      location,
      is_active
    },
    logo_url
  );

  res.status(201).json({
    status: "success",
    message: "Company created successfully",
    data: result
  });
});

/**
 * 📄 Get All Companies
 */
export const getAllCompanies = async ({ offset = 0, limit = 10 }) => {
  // Force integers (very important)
  const safeLimit = parseInt(limit, 10) || 10;
  const safeOffset = parseInt(offset, 10) || 0;

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
    LIMIT ${safeLimit} OFFSET ${safeOffset}
  `;

  return await query(sql);
};

/**
 * 🔍 Get Single Company
 */
export const getCompanyById = catchAsync(async (req, res) => {
  const result = await getCompanyByIdService(req.params.id);

  if (!result || result.length === 0) {
    return res.status(404).json({
      status: "error",
      message: "Company not found"
    });
  }

  res.status(200).json({
    status: "success",
    data: result[0]
  });
});

/**
 * ✏️ Update Company
 */
export const updateCompany = catchAsync(async (req, res) => {
  const { company_name, location, is_active } = req.body;
  const logo_url = req.file ? req.file.path : null;

  const result = await updateCompanyService(
    req.params.id,
    { company_name, location, is_active },
    logo_url
  );

  res.status(200).json({
    status: "success",
    message: "Company updated successfully",
    data: result
  });
});

/**
 * ❌ Delete Company
 */
export const deleteCompany = catchAsync(async (req, res) => {
  await deleteCompanyService(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Company deleted successfully"
  });
});