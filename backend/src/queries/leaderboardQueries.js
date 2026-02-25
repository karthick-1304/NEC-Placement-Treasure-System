// src/queries/leaderboardQueries.js

import db from "../utils/db.js";

/**
 * Get total number of students (with optional filters)
 */
export const getTotalStudents = async ({ batch, dept }) => {
  let query = `
    SELECT COUNT(*) AS total
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    WHERE u.role = 'student'
      AND u.is_blacklisted = 0
  `;

  const params = [];

  if (batch) {
    query += " AND sp.batch_year = ?";
    params.push(Number(batch));
  }

  if (dept) {
    query += " AND sp.dept_id = ?";
    params.push(Number(dept));
  }

  const [rows] = await db.execute(query, params);
  return rows[0].total;
};


/**
 * Get leaderboard students with pagination & filters
 */
export const getLeaderboardStudents = async (options = {}) => {

  let {
    limit = 10,
    offset = 0,
    batch,
    dept
  } = options;

  // Force safe integers
  limit = parseInt(limit);
  offset = parseInt(offset);

  if (isNaN(limit) || limit <= 0) limit = 10;
  if (isNaN(offset) || offset < 0) offset = 0;

  let query = `
    SELECT 
      u.user_id,
      u.full_name,
      u.email,
      sp.reg_no,
      sp.batch_year,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank,
      d.dept_name
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    JOIN depts d ON sp.dept_id = d.dept_id
    WHERE u.role = 'student'
      AND u.is_blacklisted = 0
  `;

  const params = [];

  if (batch) {
    query += " AND sp.batch_year = ?";
    params.push(Number(batch));
  }

  if (dept) {
    query += " AND sp.dept_id = ?";
    params.push(Number(dept));
  }

  query += `
    ORDER BY sp.total_score DESC,
             sp.programs_solved DESC,
             sp.updated_at ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  console.log("Final Query:", query);
  console.log("Params:", params);

  const [rows] = await db.execute(query, params);

  return rows;
};

/**
 * Get Top N students globally
 */
export const getTopStudents = async (limit = 10) => {

  limit = parseInt(limit);

  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  }

  const query = `
    SELECT 
      u.user_id,
      u.full_name,
      sp.reg_no,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    WHERE u.role = 'student'
      AND u.is_blacklisted = 0
    ORDER BY sp.total_score DESC,
             sp.programs_solved DESC,
             sp.updated_at ASC
    LIMIT ${limit}
  `;

  console.log("Top Students Limit:", limit);

  const [rows] = await db.execute(query);

  return rows;
};