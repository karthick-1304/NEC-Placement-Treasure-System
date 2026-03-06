import express from "express";
import {
  submitFeedback,
  getDriveFeedbacks
} from "../../controllers/user/studentFeedbackController.js";

import uploadFeedback from "../../utils/multerFeedback.js";
import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// Student submits feedback
router.post(
  "/",
  restrictTo("student"),
  uploadFeedback.single("feedback_pdf"),
  submitFeedback
);

// View all feedbacks for a drive
router.get(
  "/:companyId/drives/:driveId/feedbacks",
  restrictTo("admin", "student"),
  getDriveFeedbacks
);

export default router;