// src/services/admin/adminFeedbackService.js

import AppError from "../../utils/appError.js";
import {
  getAllFeedback,
  getFeedbackById,
  updateSelectionStatus,
  deleteFeedback,createFeedback,
  checkExistingFeedback
} from "../../queries/admin/adminFeedbackQueries.js";

/**
 * 📄 Get All Feedback
 */
export const getAllFeedbackService = async (filters) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  const feedback = await getAllFeedback({
    driveId: filters.drive_id,
    isSelected:
      filters.is_selected !== undefined
        ? filters.is_selected
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
 * ✅ Update Selection Status
 */
export const updateFeedbackStatusService = async (
  feedbackId,
  isSelected
) => {
  const feedback = await getFeedbackById(feedbackId);

  if (!feedback.length) {
    throw new AppError("Feedback not found", 404);
  }

  await updateSelectionStatus(feedbackId, isSelected);

  return { message: "Selection status updated successfully" };
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

export const addFeedbackService = async ({
  driveId,
  studentUserId,
  pdfUrl
}) => {
  // 🔎 Prevent duplicate submission
  const existing = await checkExistingFeedback(
    driveId,
    studentUserId
  );

  if (existing.length) {
    throw new AppError(
      "You have already submitted feedback for this drive",
      400
    );
  }

  await createFeedback({
    driveId,
    studentUserId,
    pdfUrl
  });

  return { message: "Feedback submitted successfully" };
};