// src/routes/adminRoutes.js

import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";
import { validate } from "../../middleware/validationMiddleware.js";

import { ROLES } from "../../constants/roles.js";

/* =========================
   Student Controllers
========================= */
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../../controllers/admin/adminStudentController.js";

import {
  createStudentSchema,
  updateStudentSchema,
  studentQuerySchema
} from "../../validators/studentValidator.js";

/* =========================
   Other Admin Route Modules
========================= */
import adminCompanyRoutes from "./adminCompanyRoutes.js";
import adminProgramRoutes from "./adminProgramRoutes.js";
import adminFeedbackRoutes from "./adminFeedbackRoutes.js";
import adminDashboardRoutes from "./adminDashboardRoutes.js";
import adminAnalyticsRoutes from "./adminAnalyticsRoutes.js";
import adminBulkUploadRoutes from "./adminBulkUploadRoutes.js";

const router = express.Router();

/**
 * 🔐 All Admin Routes Protected
 */
router.use(protect);
router.use(restrictTo(ROLES.ADMIN));

/* =====================================================
   🎓 Student Management (Direct Routes)
===================================================== */

// ➕ Create Student
router.post(
  "/students",
  validate(createStudentSchema),
  createStudent
);

// 📄 Get All Students
router.get(
  "/students",
  validate(studentQuerySchema, "query"),
  getAllStudents
);

// 🔍 Get Single Student
router.get("/students/:userId", getStudentById);

// ✏️ Update Student
router.patch(
  "/students/:userId",
  validate(updateStudentSchema),
  updateStudent
);


// ❌ Delete Student
router.delete("/students/:userId", deleteStudent);

/* =====================================================
   📦 Modular Admin Routes
===================================================== */

router.use("/companies", adminCompanyRoutes);
router.use("/programs", adminProgramRoutes);
router.use("/feedback", adminFeedbackRoutes);
router.use("/dashboard", adminDashboardRoutes);
router.use("/analytics", adminAnalyticsRoutes);
router.use("/bulk-upload", adminBulkUploadRoutes);

export default router;