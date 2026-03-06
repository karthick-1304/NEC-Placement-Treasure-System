// controllers/studentFeedbackController.js
import { query } from "../../utils/db.js";
import db from "../../utils/db.js";
import {
  addOrUpdateFeedback,
} from "../../services/user/studentFeedbackService.js";

export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!req.body.drive_id) {
      return res.status(400).json({
        success: false,
        message: "drive_id is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Feedback PDF is required"
      });
    }

    const filePath = `/uploads/feedbacks/${req.file.filename}`;

    const data = {
      drive_id: Number(req.body.drive_id),
      feedback_pdf_url: filePath,
      is_selected: Number(req.body.is_selected) || 0
    };

    const result = await addOrUpdateFeedback(userId, data);

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit feedback"
    });
  }
};

// controllers/user/studentFeedbackController.js
export const getDriveFeedbacks = async (req, res) => {
  console.log("PARAMS RECEIVED:", req.params);
  try {
    const { driveId } = req.params;

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

    res.status(200).json(mapped);

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