// src/services/admin/adminQuestionService.js

import AppError from "../../utils/appError.js";
import {
  getQuestionByTitle,
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from "../../queries/admin/adminQuestionQueries.js";

/**
 * ➕ Create Question
 */
export const createQuestionService = async (data) => {
  const {
    title,
    description,
    difficulty,
    category_id,
    company_id,
    marks
  } = data;

  // 1️⃣ Check duplicate title
  const existing = await getQuestionByTitle(title);
  if (existing.length) {
    throw new AppError("Question with this title already exists", 400);
  }

  // 2️⃣ Insert
  const result = await createQuestion(
    title,
    description,
    difficulty,
    category_id,
    company_id,
    marks
  );

  return {
    message: "Question created successfully",
    questionId: result.insertId
  };
};

/**
 * 📄 Get All Questions
 */
export const getAllQuestionsService = async (filters) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  const questions = await getAllQuestions({
    difficulty: filters.difficulty,
    categoryId: filters.category_id,
    companyId: filters.company_id,
    offset,
    limit
  });

  return {
    page,
    limit,
    count: questions.length,
    data: questions
  };
};

/**
 * 🔍 Get Single Question
 */
export const getQuestionByIdService = async (questionId) => {
  const question = await getQuestionById(questionId);

  if (!question.length) {
    throw new AppError("Question not found", 404);
  }

  return question[0];
};

/**
 * ✏️ Update Question
 */
export const updateQuestionService = async (questionId, data) => {
  const question = await getQuestionById(questionId);

  if (!question.length) {
    throw new AppError("Question not found", 404);
  }

  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (!fields.length) {
    throw new AppError("No fields provided for update", 400);
  }

  await updateQuestion(questionId, fields.join(", "), values);

  return { message: "Question updated successfully" };
};

/**
 * ❌ Delete Question
 */
export const deleteQuestionService = async (questionId) => {
  const question = await getQuestionById(questionId);

  if (!question.length) {
    throw new AppError("Question not found", 404);
  }

  await deleteQuestion(questionId);

  return { message: "Question deleted successfully" };
};