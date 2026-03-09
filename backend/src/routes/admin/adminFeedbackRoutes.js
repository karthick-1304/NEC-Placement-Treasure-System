// src/routes/admin/adminFeedbackRoutes.js

import express from "express";
import uploadFeedback from "../../utils/multerFeedback.js";

import {
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  addFeedback
} from "../../controllers/admin/adminFeedbackController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * 🔐 Protect all admin feedback routes
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * 📄 Get All Feedback
 */
router.get("/feedbacks", getAllFeedback);

/**
 * ➕ Admin Upload Feedback
 */
router.post(
  "/feedbacks",
  uploadFeedback.single("feedback_pdf"),
  addFeedback
);

/**
 * 🔍 Get Single Feedback
 */
router.get("/feedbacks/:id", getFeedbackById);

/**
 * ✅ Update Feedback Status
 */
router.patch("/feedbacks/:id/status", updateFeedbackStatus);

/**
 * ❌ Delete Feedback
 */
router.delete("/feedbacks/:id", deleteFeedback);

export default router;