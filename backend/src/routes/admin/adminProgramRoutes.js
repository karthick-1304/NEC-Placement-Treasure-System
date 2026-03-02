// src/routes/admin/adminProgramRoutes.js

import express from "express";

import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram
} from "../../controllers/admin/adminProgramController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";
import validate from "../../middleware/validationMiddleware.js";

import {
  createProgramSchema,
  updateProgramSchema,
  programQuerySchema
} from "../../validators/programValidator.js";

const router = express.Router();

/**
 * 🔐 Protect all admin program routes
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * ➕ Create Program
 */
router.post(
  "/",
  validate(createProgramSchema),
  createProgram
);

/**
 * 📄 Get All Programs
 */
router.get(
  "/",
  validate(programQuerySchema, "query"),
  getAllPrograms
);

/**
 * 🔍 Get Single Program
 */
router.get("/:id", getProgramById);

/**
 * ✏️ Update Program
 */
router.patch(
  "/:id",
  validate(updateProgramSchema),
  updateProgram
);

/**
 * ❌ Delete Program
 */
router.delete("/:id", deleteProgram);

export default router;