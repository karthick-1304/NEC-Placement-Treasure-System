// routes/studentFeedbackRoutes.js

import express from "express";
import {
  submitFeedback,
  getMyFeedback
} from "../../controllers/user/studentFeedbackController.js";

import uploadFeedback from "../../utils/multerFeedback.js";
import { protect } from "../../middleware/authMiddleware.js";
import {restrictTo} from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Only student access
router.use(protect);
router.use(restrictTo("student"));

// Submit / Update feedback
router.post(
  "/",
  uploadFeedback.single("feedback_pdf"),
  submitFeedback
);

// View my feedback
router.get("/my", getMyFeedback);

export default router;