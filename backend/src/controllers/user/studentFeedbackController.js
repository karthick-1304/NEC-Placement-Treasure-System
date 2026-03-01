// controllers/studentFeedbackController.js

import {
  addOrUpdateFeedback,
  getMyFeedbacks
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

export const getMyFeedback = async (req, res) => {
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
};