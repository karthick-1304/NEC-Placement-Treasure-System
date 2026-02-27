// src/routes/admin/adminQuestionRoutes.js

import express from "express";

import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from "../../controllers/admin/adminQuestionController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";
import validate from "../../middleware/validationMiddleware.js";

import {
  createQuestionSchema,
  updateQuestionSchema,
  questionQuerySchema
} from "../../validators/questionValidator.js";

const router = express.Router();

/**
 * 🔐 Protect all admin question routes
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * ➕ Create Question
 */
router.post(
  "/",
  validate(createQuestionSchema),
  createQuestion
);

/**
 * 📄 Get All Questions
 */
router.get(
  "/",
  validate(questionQuerySchema, "query"),
  getAllQuestions
);

/**
 * 🔍 Get Single Question
 */
router.get("/:id", getQuestionById);

/**
 * ✏️ Update Question
 */
router.patch(
  "/:id",
  validate(updateQuestionSchema),
  updateQuestion
);

/**
 * ❌ Delete Question
 */
router.delete("/:id", deleteQuestion);

export default router;