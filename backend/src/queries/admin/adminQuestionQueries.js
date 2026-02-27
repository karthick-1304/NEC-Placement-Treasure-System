// src/queries/admin/adminQuestionQueries.js

import { query } from "../../utils/db.js";

/**
 * 🔎 Get Question By Title
 */
export const getQuestionByTitle = async (title) => {
  return await query(
    `SELECT question_id FROM questions WHERE title = ?`,
    [title]
  );
};

/**
 * ➕ Create Question
 */
export const createQuestion = async (
  title,
  description,
  difficulty,
  category_id,
  company_id,
  marks,
  is_active = true
) => {
  return await query(
    `INSERT INTO questions
      (title, description, difficulty, category_id, company_id, marks, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      difficulty,
      category_id,
      company_id,
      marks,
      is_active
    ]
  );
};

/**
 * 📄 Get All Questions (Filters + Pagination)
 */
export const getAllQuestions = async ({
  difficulty,
  categoryId,
  companyId,
  offset,
  limit
}) => {
  let sql = `
    SELECT 
      q.question_id,
      q.title,
      q.description,
      q.difficulty,
      q.category_id,
      q.company_id,
      q.marks,
      q.is_active,
      q.created_at
    FROM questions q
    WHERE 1=1
  `;

  const params = [];

  if (difficulty) {
    sql += ` AND q.difficulty = ?`;
    params.push(difficulty);
  }

  if (categoryId) {
    sql += ` AND q.category_id = ?`;
    params.push(categoryId);
  }

  if (companyId) {
    sql += ` AND q.company_id = ?`;
    params.push(companyId);
  }

  sql += ` ORDER BY q.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return await query(sql, params);
};

/**
 * 🔍 Get Question By ID
 */
export const getQuestionById = async (questionId) => {
  return await query(
    `SELECT 
      question_id,
      title,
      description,
      difficulty,
      category_id,
      company_id,
      marks,
      is_active
     FROM questions
     WHERE question_id = ?`,
    [questionId]
  );
};

/**
 * ✏️ Update Question
 */
export const updateQuestion = async (questionId, fields, values) => {
  const sql = `
    UPDATE questions
    SET ${fields}
    WHERE question_id = ?
  `;

  return await query(sql, [...values, questionId]);
};

/**
 * ❌ Delete Question
 */
export const deleteQuestion = async (questionId) => {
  return await query(
    `DELETE FROM questions WHERE question_id = ?`,
    [questionId]
  );
};