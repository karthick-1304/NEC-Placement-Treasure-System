// src/controllers/admin/adminFeedbackController.js
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import {
  getAllFeedbackService,
  getFeedbackByIdService,
  updateFeedbackStatusService,
  deleteFeedbackService,
  addFeedbackService
} from "../../services/admin/adminFeedbackService.js";

/**
 * 📄 Get All Feedback
 */
export const getAllFeedback = catchAsync(async (req, res) => {
  const result = await getAllFeedbackService(req.query);

  res.status(200).json({
    status: "success",
    ...result
  });
});

/**
 * 🔍 Get Single Feedback
 */
export const getFeedbackById = catchAsync(async (req, res) => {
  const result = await getFeedbackByIdService(req.params.id);

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ✅ Update Feedback Status (Resolve / Unresolve)
 */
export const updateFeedbackStatus = catchAsync(async (req, res) => {
  const { is_selected } = req.body;

  const result = await updateFeedbackStatusService(
    req.params.id,
    is_selected
  );

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ❌ Delete Feedback
 */
export const deleteFeedback = catchAsync(async (req, res) => {
  const result = await deleteFeedbackService(req.params.id);

  res.status(200).json({
    status: "success",
    data: result
  });
});

export const addFeedback = catchAsync(async (req, res) => {
  const { drive_id, student_user_id, is_selected } = req.body;

  if (!drive_id) throw new AppError("Drive ID is required", 400);
  if (!student_user_id) throw new AppError("Student User ID is required", 400);
  if (!req.file) throw new AppError("Feedback PDF is required", 400);

  const pdfUrl = `/uploads/feedbacks/${req.file.filename}`;

  const result = await addFeedbackService({
    driveId: parseInt(drive_id, 10),
    studentUserId: parseInt(student_user_id, 10),
    pdfUrl,
    isSelected: is_selected === "1" ? 1 : 0  // convert string to number
  });

  res.status(201).json({
    status: "success",
    data: result
  });
});