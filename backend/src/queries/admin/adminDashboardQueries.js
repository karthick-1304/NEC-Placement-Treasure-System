// backend/src/queries/admin/adminDashboardQueries.js

import { query } from "../../utils/db.js";

/**
 * 👨‍🎓 Total Students
 */
export const getTotalStudents = async () => {
  return await query(
    `SELECT COUNT(*) AS total_students 
     FROM users 
     WHERE role = 'student'`
  );
};

/**
 * 🏢 Total Companies
 */
export const getTotalCompanies = async () => {
  return await query(
    `SELECT COUNT(*) AS total_companies 
     FROM companies`
  );
};

/**
 * ❓ Total Questions
 */
export const getTotalPrograms = async () => {
  return await query(
    `SELECT COUNT(*) AS total_programs 
     FROM programs`
  );
};

/**
 * 📝 Total Feedback
 */
export const getTotalFeedback = async () => {
  return await query(
    `SELECT COUNT(*) AS total_feedback 
     FROM placement_feedbacks`
  );
};

/**
 * 📊 Recent Students (Last 5)
 */
export const getRecentStudents = async () => {
  return await query(
    `SELECT user_id, full_name, email, created_at
     FROM users
     WHERE role = 'student'
     ORDER BY created_at DESC
     LIMIT 5`
  );
};

/**
 * 🏢 Recent Companies (Last 5)
 */
export const getRecentCompanies = async () => {
  return await query(
    `SELECT 
        company_id,
        company_name,
        location,
        created_at
     FROM companies
     ORDER BY created_at DESC
     LIMIT 5`
  );
};

export const getProgramsByDifficulty = async () => {
  return await query(
    `SELECT difficulty, COUNT(*) AS total
     FROM programs
     GROUP BY difficulty`
  );
};
/**
 * 🔥 Top 5 Students (Based on Score)
 */
export const getTopStudents = async () => {
  return await query(
    `
    SELECT 
      u.user_id,
      u.full_name,
      sp.reg_no,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank,
      d.dept_name
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    JOIN depts d ON sp.dept_id = d.dept_id
    WHERE u.role = 'student'
      AND u.is_blacklisted = 0
    ORDER BY sp.total_score DESC,
             sp.programs_solved DESC,
             sp.updated_at ASC
    LIMIT 5
    `
  );
};

/**
 * 📅 Monthly Student Registrations (Current Year)
 */
export const getMonthlyRegistrations = async () => {
  return await query(
    `SELECT 
        MONTH(created_at) AS month,
        COUNT(*) AS total
     FROM users
     WHERE role = 'student'
       AND YEAR(created_at) = YEAR(CURDATE())
     GROUP BY MONTH(created_at)
     ORDER BY month ASC`
  );
};