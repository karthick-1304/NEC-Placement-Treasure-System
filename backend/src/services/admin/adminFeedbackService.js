// src/services/admin/adminFeedbackService.js

import AppError from "../../utils/appError.js";
import {
  getAllFeedback,
  getFeedbackById,
  markFeedbackResolved,
  deleteFeedback
} from "../../queries/admin/adminFeedbackQueries.js";

/**
 * 📄 Get All Feedback
 */
export const getAllFeedbackService = async (filters) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  const feedback = await getAllFeedback({
    userId: filters.user_id,
    rating: filters.rating,
    isResolved:
      filters.is_resolved !== undefined
        ? filters.is_resolved
        : undefined,
    offset,
    limit
  });

  return {
    page,
    limit,
    count: feedback.length,
    data: feedback
  };
};

/**
 * 🔍 Get Single Feedback
 */
export const getFeedbackByIdService = async (feedbackId) => {
  const feedback = await getFeedbackById(feedbackId);

  if (!feedback.length) {
    throw new AppError("Feedback not found", 404);
  }

  return feedback[0];
};

/**
 * ✅ Update Feedback Resolution Status
 */
export const updateFeedbackStatusService = async (
  feedbackId,
  isResolved
) => {
  const feedback = await getFeedbackById(feedbackId);

  if (!feedback.length) {
    throw new AppError("Feedback not found", 404);
  }

  await markFeedbackResolved(feedbackId, isResolved);

  return { message: "Feedback status updated successfully" };
};

/**
 * ❌ Delete Feedback
 */
export const deleteFeedbackService = async (feedbackId) => {
  const feedback = await getFeedbackById(feedbackId);

  if (!feedback.length) {
    throw new AppError("Feedback not found", 404);
  }

  await deleteFeedback(feedbackId);

  return { message: "Feedback deleted successfully" };
};