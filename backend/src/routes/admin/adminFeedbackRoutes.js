// src/routes/admin/adminFeedbackRoutes.js

import express from "express";

import {
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback
} from "../../controllers/admin/adminFeedbackController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * 🔐 Protect all admin feedback routes
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * 📄 Get All Feedback
 */
router.get("/", getAllFeedback);

/**
 * 🔍 Get Single Feedback
 */
router.get("/:id", getFeedbackById);

/**
 * ✅ Update Feedback Status (Resolve / Unresolve)
 */
router.patch("/:id/status", updateFeedbackStatus);

/**
 * ❌ Delete Feedback
 */
router.delete("/:id", deleteFeedback);

export default router;