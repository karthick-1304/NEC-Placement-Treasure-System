// src/routes/admin/adminCompanyRoutes.js

import express from "express";

import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../../controllers/admin/adminCompanyController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";
import validate from "../../middleware/validationMiddleware.js";

import {
  createCompanySchema,
  updateCompanySchema,
  companyQuerySchema
} from "../../validators/companyValidator.js";

const router = express.Router();

/**
 * 🔐 All routes below are protected
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * ➕ Create Company
 */
router.post(
  "/",
  upload.single("logo"),
  validate(createCompanySchema),
  createCompany
);

/**
 * 📄 Get All Companies
 */
router.get(
  "/",
  validate(companyQuerySchema, "query"),
  getAllCompanies
);

/**
 * 🔍 Get Single Company
 */
router.get("/:id", getCompanyById);

/**
 * ✏️ Update Company
 */
router.patch(
  "/:id",
  upload.single("logo"),
  validate(updateCompanySchema),
  updateCompany
);

/**
 * ❌ Delete Company
 */
router.delete("/:id", deleteCompany);

export default router;