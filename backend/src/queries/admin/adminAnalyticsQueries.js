// backend/src/queries/admin/adminAnalyticsQueries.js

import { query } from "../../utils/db.js";

/**
 * 📊 Students Count By Department
 */
export const getStudentsByDepartment = async () => {
  return await query(
    `SELECT 
        d.dept_id,
        d.dept_name,
        COUNT(u.user_id) AS total_students
     FROM departments d
     LEFT JOIN users u 
        ON u.dept_id = d.dept_id 
        AND u.role = 'student'
     GROUP BY d.dept_id, d.dept_name
     ORDER BY total_students DESC`
  );
};

/**
 * 📈 Questions Count By Difficulty
 */
export const getQuestionsByDifficulty = async () => {
  return await query(
    `SELECT 
        difficulty,
        COUNT(*) AS total_questions
     FROM questions
     GROUP BY difficulty
     ORDER BY total_questions DESC`
  );
};

/**
 * 🏢 Company Visit Trend (Year Wise)
 */
export const getCompanyVisitsByYear = async () => {
  return await query(
    `SELECT 
        visit_year,
        COUNT(*) AS total_companies
     FROM companies
     GROUP BY visit_year
     ORDER BY visit_year DESC`
  );
};

/**
 * 🏆 Average Score By Department
 */
export const getAverageScoreByDepartment = async () => {
  return await query(
    `SELECT 
        d.dept_id,
        d.dept_name,
        ROUND(AVG(l.total_score), 2) AS avg_score
     FROM departments d
     LEFT JOIN users u 
        ON u.dept_id = d.dept_id 
        AND u.role = 'student'
     LEFT JOIN leaderboard l 
        ON l.user_id = u.user_id
     GROUP BY d.dept_id, d.dept_name
     ORDER BY avg_score DESC`
  );
};

/**
 * 📝 Feedback Rating Distribution
 */
export const getFeedbackRatingDistribution = async () => {
  return await query(
    `SELECT 
        rating,
        COUNT(*) AS total
     FROM feedback
     GROUP BY rating
     ORDER BY rating ASC`
  );
};

/**
 * 📅 Monthly Question Creation Trend (Current Year)
 */
export const getMonthlyQuestionTrend = async () => {
  return await query(
    `SELECT 
        MONTH(created_at) AS month,
        COUNT(*) AS total_questions
     FROM questions
     WHERE YEAR(created_at) = YEAR(CURDATE())
     GROUP BY MONTH(created_at)
     ORDER BY month ASC`
  );
};