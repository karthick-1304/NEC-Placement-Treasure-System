// controllers/studentFeedbackController.js
import db from "../../utils/db.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import { addOrUpdateFeedback } from "../../services/user/studentFeedbackService.js";

export const submitFeedback = catchAsync(async (req, res) => {
  const userId = req.user.user_id;
  const { drive_id, is_selected } = req.body;

  // ✅ Validation
  if (!drive_id) throw new AppError("Drive ID is required", 400);
  if (!req.file) throw new AppError("Feedback PDF is required", 400);

  const pdfUrl = `/uploads/feedbacks/${req.file.filename}`;

  const result = await addOrUpdateFeedback(userId, {
    drive_id: parseInt(drive_id, 10),
    feedback_pdf_url: pdfUrl,
    is_selected: is_selected === "1" ? 1 : 0  // string → number
  });

  res.status(201).json({
    status: "success",
    data: result
  });
});

// controllers/user/studentFeedbackController.js
export const getDriveFeedbacks = async (req, res) => {
  try {
    const driveId = req.params.driveId || req.body.drive_id; // fallback to body if needed

    if (!driveId) throw new AppError("Drive ID is required", 400);

    const [rows] = await db.query(
      `SELECT f.feedback_id,
              u.full_name,
              sp.reg_no,
              u.email,
              f.is_selected,
              f.feedback_pdf_url
       FROM placement_feedbacks f
       JOIN users u ON u.user_id = f.student_user_id
       JOIN student_profiles sp ON sp.user_id = u.user_id
       WHERE f.drive_id = ?`,
      [driveId]
    );

    const mapped = rows.map(fb => ({
      ...fb,
      feedback_pdf_url: fb.feedback_pdf_url
        ? `${req.protocol}://${req.get("host")}${fb.feedback_pdf_url}`
        : null
    }));

    res.status(200).json({
      status: "success",
      count: mapped.length,
      data: mapped
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};
/*export const getMyFeedback = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const feedbacks = await getMyFeedbacks(userId);

    res.status(200).json({
      success: true,
      data: feedbacks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback"
    });
  }
};*/