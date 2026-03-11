// src/queries/progressQueries.js

import pool from "../../utils/db.js";

/**
 * Weekly solving trend
 * Returns solved programs grouped by week for a specific month
 */
export const getWeeklyTrendQuery = async (userId, year, month) => {
  const query = `
    SELECT 
      WEEK(solved_at, 1) AS week_number,
      COUNT(*) AS solved_count
    FROM solved_programs
    WHERE student_user_id = ?
      AND YEAR(solved_at) = ?
      AND MONTH(solved_at) = ?
    GROUP BY week_number
    ORDER BY week_number;
  `;

  const [rows] = await pool.execute(query, [userId, year, month]);
  return rows;
};


/**
 * Monthly solving trend
 * Returns solved programs grouped by month for a specific year
 */
export const getMonthlyTrendQuery = async (userId, year) => {
  const query = `
    SELECT 
      MONTH(solved_at) AS month_number,
      COUNT(*) AS solved_count
    FROM solved_programs
    WHERE student_user_id = ?
      AND YEAR(solved_at) = ?
    GROUP BY month_number
    ORDER BY month_number;
  `;

  const [rows] = await pool.execute(query, [userId, year]);
  return rows;
};


/**
 * Active days in last 30 days
 * Used for consistency score
 */
export const getActiveDaysLast30Query = async (userId) => {
  const query = `
    SELECT 
      COUNT(DISTINCT DATE(solved_at)) AS active_days
    FROM solved_programs
    WHERE student_user_id = ?
      AND solved_at >= NOW() - INTERVAL 30 DAY;
  `;

  const [rows] = await pool.execute(query, [userId]);
  return rows[0];
};


/**
 * Total solved programs
 * Used for milestones
 */
export const getTotalSolvedProgramsQuery = async (userId) => {
  const query = `
    SELECT COUNT(*) AS total_solved
    FROM solved_programs
    WHERE student_user_id = ?;
  `;

  const [rows] = await pool.execute(query, [userId]);
  return rows[0];
};