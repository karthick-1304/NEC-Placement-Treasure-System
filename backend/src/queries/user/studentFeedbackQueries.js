// queries/studentFeedbackQueries.js

export const CHECK_EXISTING_FEEDBACK = `
  SELECT feedback_id, feedback_pdf_url
  FROM placement_feedbacks
  WHERE drive_id = ? AND student_user_id = ?
`;

export const INSERT_FEEDBACK = `
  INSERT INTO placement_feedbacks
  (drive_id, student_user_id, feedback_pdf_url, is_selected)
  VALUES (?, ?, ?, ?)
`;

export const UPDATE_FEEDBACK = `
  UPDATE placement_feedbacks
  SET feedback_pdf_url = ?, is_selected = ?
  WHERE drive_id = ? AND student_user_id = ?
`;

export const GET_MY_FEEDBACKS = `
  SELECT *
  FROM placement_feedbacks
  WHERE student_user_id = ?
  ORDER BY submitted_at DESC
`;