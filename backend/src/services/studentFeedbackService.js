// services/studentFeedbackService.js

import db from "../utils/db.js";
import fs from "fs";
import {
  CHECK_EXISTING_FEEDBACK,
  INSERT_FEEDBACK,
  UPDATE_FEEDBACK,
  GET_MY_FEEDBACKS
} from "../queries/studentFeedbackQueries.js";

export const addOrUpdateFeedback = async (userId, data) => {
  const { drive_id, feedback_pdf_url, is_selected } = data;

  const [existing] = await db.query(CHECK_EXISTING_FEEDBACK, [
    drive_id,
    userId
  ]);

  // If already exists → update
  if (existing.length > 0) {
    const oldFile = existing[0].feedback_pdf_url;

    // Delete old file if exists
    if (oldFile && fs.existsSync("." + oldFile)) {
      fs.unlinkSync("." + oldFile);
    }

    await db.query(UPDATE_FEEDBACK, [
      feedback_pdf_url,
      is_selected,
      drive_id,
      userId
    ]);

    return { message: "Feedback updated successfully" };
  }

  // Else insert
  await db.query(INSERT_FEEDBACK, [
    drive_id,
    userId,
    feedback_pdf_url,
    is_selected
  ]);

  return { message: "Feedback submitted successfully" };
};

export const getMyFeedbacks = async (userId) => {
  const [rows] = await db.query(GET_MY_FEEDBACKS, [userId]);
  return rows;
};