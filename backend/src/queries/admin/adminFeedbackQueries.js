// src/queries/admin/adminFeedbackQueries.js

import { query } from "../../utils/db.js";

/**
 * 📄 Get All Feedback (Filters + Pagination)
 */
export const getAllFeedback = async ({
  userId,
  rating,
  isResolved,
  offset,
  limit
}) => {
  let sql = `
    SELECT 
      f.feedback_id,
      f.user_id,
      u.full_name,
      u.email,
      f.message,
      f.rating,
      f.is_resolved,
      f.created_at
    FROM feedback f
    LEFT JOIN users u ON f.user_id = u.user_id
    WHERE 1=1
  `;

  const params = [];

  if (userId) {
    sql += ` AND f.user_id = ?`;
    params.push(userId);
  }

  if (rating) {
    sql += ` AND f.rating = ?`;
    params.push(rating);
  }

  if (isResolved !== undefined) {
    sql += ` AND f.is_resolved = ?`;
    params.push(isResolved);
  }

  sql += ` ORDER BY f.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return await query(sql, params);
};

/**
 * 🔍 Get Feedback By ID
 */
export const getFeedbackById = async (feedbackId) => {
  return await query(
    `SELECT 
      f.feedback_id,
      f.user_id,
      u.full_name,
      u.email,
      f.message,
      f.rating,
      f.is_resolved,
      f.created_at
     FROM feedback f
     LEFT JOIN users u ON f.user_id = u.user_id
     WHERE f.feedback_id = ?`,
    [feedbackId]
  );
};

/**
 * ✅ Mark Feedback As Resolved
 */
export const markFeedbackResolved = async (feedbackId, status) => {
  return await query(
    `UPDATE feedback
     SET is_resolved = ?
     WHERE feedback_id = ?`,
    [status, feedbackId]
  );
};

/**
 * ❌ Delete Feedback
 */
export const deleteFeedback = async (feedbackId) => {
  return await query(
    `DELETE FROM feedback
     WHERE feedback_id = ?`,
    [feedbackId]
  );
};