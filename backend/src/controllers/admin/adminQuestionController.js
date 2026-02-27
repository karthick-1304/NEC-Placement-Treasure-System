// src/controllers/admin/adminQuestionController.js

import catchAsync from "../../utils/catchAsync.js";
import {
  createQuestionService,
  getAllQuestionsService,
  getQuestionByIdService,
  updateQuestionService,
  deleteQuestionService
} from "../../services/admin/adminQuestionService.js";

/**
 * ➕ Create Question
 */
export const createQuestion = catchAsync(async (req, res) => {
  const result = await createQuestionService(req.body);

  res.status(201).json({
    status: "success",
    data: result
  });
});

/**
 * 📄 Get All Questions
 */
export const getAllQuestions = catchAsync(async (req, res) => {
  const result = await getAllQuestionsService(req.query);

  res.status(200).json({
    status: "success",
    ...result
  });
});

/**
 * 🔍 Get Single Question
 */
export const getQuestionById = catchAsync(async (req, res) => {
  const result = await getQuestionByIdService(req.params.id);

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ✏️ Update Question
 */
export const updateQuestion = catchAsync(async (req, res) => {
  const result = await updateQuestionService(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ❌ Delete Question
 */
export const deleteQuestion = catchAsync(async (req, res) => {
  const result = await deleteQuestionService(req.params.id);

  res.status(200).json({
    status: "success",
    data: result
  });
});