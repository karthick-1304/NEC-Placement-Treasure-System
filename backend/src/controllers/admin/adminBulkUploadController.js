// backend/src/controllers/admin/adminBulkUploadController.js

import catchAsync from "../../utils/catchAsync.js";
import {
  bulkUploadStudentsService,
  bulkUploadQuestionsService,
  bulkUploadCompaniesService
} from "../../services/admin/adminBulkUploadService.js";

/**
 * 👨‍🎓 Bulk Upload Students (CSV Parsed Data Expected in req.body.data)
 */
export const bulkUploadStudents = catchAsync(async (req, res) => {
  const { data } = req.body;

  const result = await bulkUploadStudentsService(data);

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ❓ Bulk Upload Questions
 */
export const bulkUploadQuestions = catchAsync(async (req, res) => {
  const { data } = req.body;

  const result = await bulkUploadQuestionsService(data);

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * 🏢 Bulk Upload Companies
 */
export const bulkUploadCompanies = catchAsync(async (req, res) => {
  const { data } = req.body;

  const result = await bulkUploadCompaniesService(data);

  res.status(200).json({
    status: "success",
    data: result
  });
});