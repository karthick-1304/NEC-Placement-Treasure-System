// backend/src/queries/admin/adminAnalyticsQueries.js

import { query } from "../../utils/db.js";

/**
 * 📊 Students Count By Department
 */
export const getStudentsByDepartment = async () => {
  return await query(`
    SELECT 
        d.dept_id,
        d.dept_name,
        COUNT(sp.user_id) AS total_students
    FROM depts d
    LEFT JOIN student_profiles sp 
        ON sp.dept_id = d.dept_id
    GROUP BY d.dept_id, d.dept_name
    ORDER BY total_students DESC
  `);
};

/**
 * 📈 Programs Count By Difficulty
 */
export const getProgramsByDifficulty = async () => {
  return await query(`
    SELECT 
        difficulty,
        COUNT(*) AS total_programs
    FROM programs
    GROUP BY difficulty
    ORDER BY total_programs DESC
  `);
};

/**
 * 🏢 Total Active Companies Count
 */
export const getCompanyCount = async () => {
  return await query(`
    SELECT 
        COUNT(*) AS total_companies
    FROM companies
    WHERE is_active = 1
  `);
};

/**
 * 🏆 Average Score By Department
 */
export const getAverageScoreByDepartment = async () => {
  return await query(`
    SELECT 
        d.dept_id,
        d.dept_name,
        ROUND(COALESCE(AVG(sp.total_score), 0), 2) AS avg_score
    FROM depts d
    LEFT JOIN student_profiles sp 
        ON sp.dept_id = d.dept_id
    GROUP BY d.dept_id, d.dept_name
    ORDER BY avg_score DESC
  `);
};

/**
 * 📝 Placement Selection Statistics
 */
export const getSelectionStats = async () => {
  return await query(`
    SELECT 
        CASE 
            WHEN is_selected = 1 THEN 'Selected'
            ELSE 'Not Selected'
        END AS selection_status,
        COUNT(*) AS total
    FROM placement_feedbacks
    GROUP BY is_selected
  `);
};

/**
 * 📅 Monthly Program Creation Trend (Current Year)
 */
export const getMonthlyProgramTrend = async () => {
  return await query(`
    SELECT 
        MONTH(created_at) AS month_number,
        DATE_FORMAT(created_at, '%M') AS month_name,
        COUNT(*) AS total_programs
    FROM programs
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%M')
    ORDER BY month_number ASC
  `);
};

/**
 * 🏢 Company Creation Trend (Year Wise)
 */
export const getCompanyVisitsByYear = async () => {
  return await query(`
    SELECT 
        YEAR(created_at) AS year,
        COUNT(*) AS total_companies
    FROM companies
    WHERE is_active = 1
    GROUP BY YEAR(created_at)
    ORDER BY year DESC
  `);
};