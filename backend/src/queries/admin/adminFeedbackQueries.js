import { query } from "../../utils/db.js";

/**
 * 📄 Get All Placement Feedback (Admin)
 * Supports filters + pagination
 */
export const getAllFeedback = async ({
  companyId,
  batchYear,
  isSelected,
  offset,
  limit
}) => {
  let sql = `
    SELECT 
      pf.feedback_id,
      pf.drive_id,

      c.company_id,
      c.company_name,

      rd.batch_year AS drive_batch,
      rd.ctc_package,

      pf.student_user_id,
      u.full_name,
      u.email,

      sp.reg_no,
      sp.batch_year AS student_batch,
      sp.global_rank,
      sp.total_score,
      sp.programs_solved,

      pf.feedback_pdf_url,
      pf.is_selected,
      pf.submitted_at

    FROM placement_feedbacks pf

    LEFT JOIN recruitment_drives rd
      ON pf.drive_id = rd.drive_id

    LEFT JOIN companies c
      ON rd.company_id = c.company_id

    LEFT JOIN student_profiles sp
      ON pf.student_user_id = sp.user_id

    LEFT JOIN users u
      ON sp.user_id = u.user_id

    WHERE 1=1
  `;

  const params = [];

  // 🔎 Filter by company
  if (companyId) {
    sql += ` AND c.company_id = ?`;
    params.push(companyId);
  }

  // 🔎 Filter by drive batch year
  if (batchYear) {
    sql += ` AND rd.batch_year = ?`;
    params.push(batchYear);
  }

  // 🔎 Filter by selection status
  if (isSelected !== undefined) {
    sql += ` AND pf.is_selected = ?`;
    params.push(isSelected);
  }

  sql += `
    ORDER BY pf.submitted_at DESC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  return await query(sql, params);
};

/**
 * 🔢 Get Total Count (for pagination)
 */
export const getFeedbackCount = async ({
  companyId,
  batchYear,
  isSelected
}) => {
  let sql = `
    SELECT COUNT(*) AS total
    FROM placement_feedbacks pf
    LEFT JOIN recruitment_drives rd
      ON pf.drive_id = rd.drive_id
    LEFT JOIN companies c
      ON rd.company_id = c.company_id
    WHERE 1=1
  `;

  const params = [];

  if (companyId) {
    sql += ` AND c.company_id = ?`;
    params.push(companyId);
  }

  if (batchYear) {
    sql += ` AND rd.batch_year = ?`;
    params.push(batchYear);
  }

  if (isSelected !== undefined) {
    sql += ` AND pf.is_selected = ?`;
    params.push(isSelected);
  }

  const [result] = await query(sql, params);
  return result.total;
};

/**
 * 🔍 Get Single Feedback By ID
 */
export const getFeedbackById = async (feedbackId) => {
  const sql = `
    SELECT 
      pf.feedback_id,
      pf.drive_id,

      c.company_id,
      c.company_name,

      rd.batch_year AS drive_batch,
      rd.ctc_package,

      pf.student_user_id,
      u.full_name,
      u.email,

      sp.reg_no,
      sp.batch_year AS student_batch,
      sp.global_rank,
      sp.total_score,
      sp.programs_solved,

      pf.feedback_pdf_url,
      pf.is_selected,
      pf.submitted_at

    FROM placement_feedbacks pf

    LEFT JOIN recruitment_drives rd
      ON pf.drive_id = rd.drive_id

    LEFT JOIN companies c
      ON rd.company_id = c.company_id

    LEFT JOIN student_profiles sp
      ON pf.student_user_id = sp.user_id

    LEFT JOIN users u
      ON sp.user_id = u.user_id

    WHERE pf.feedback_id = ?
  `;

  return await query(sql, [feedbackId]);
};

/**
 * ✅ Update Selection Status (Admin marks selected / not selected)
 */
export const updateSelectionStatus = async (feedbackId, status) => {
  return await query(
    `UPDATE placement_feedbacks
     SET is_selected = ?
     WHERE feedback_id = ?`,
    [status, feedbackId]
  );
};

/**
 * ❌ Delete Feedback
 */
export const deleteFeedback = async (feedbackId) => {
  return await query(
    `DELETE FROM placement_feedbacks
     WHERE feedback_id = ?`,
    [feedbackId]
  );
};

export const createFeedback = async ({
  driveId,
  studentUserId,
  pdfUrl
}) => {
  const sql = `
    INSERT INTO placement_feedbacks
      (drive_id, student_user_id, feedback_pdf_url)
    VALUES (?, ?, ?)
  `;

  return await query(sql, [driveId, studentUserId, pdfUrl]);
};

/**
 * 🔎 Check if student already submitted for drive
 */
export const checkExistingFeedback = async (
  driveId,
  studentUserId
) => {
  const sql = `
    SELECT feedback_id
    FROM placement_feedbacks
    WHERE drive_id = ?
      AND student_user_id = ?
  `;

  return await query(sql, [driveId, studentUserId]);
};