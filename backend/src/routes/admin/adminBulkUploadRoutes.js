// backend/src/routes/admin/adminBulkUploadRoutes.js

import express from "express";
import {
  bulkUploadStudents,
  bulkUploadPrograms,
  bulkUploadCompanies
} from "../../controllers/admin/adminBulkUploadController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * 🔐 Protect all bulk upload routes
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * 👨‍🎓 Bulk Upload Students
 * Expecting parsed CSV data in req.body.data
 */
router.post("/students", bulkUploadStudents);

/**
 * ❓ Bulk Upload Questions
 */
router.post("/programs", bulkUploadPrograms);

/**
 * 🏢 Bulk Upload Companies
 */
router.post("/companies", bulkUploadCompanies);

export default router;