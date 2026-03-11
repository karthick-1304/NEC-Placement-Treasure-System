import db from "../../utils/db.js";

/*
TOTAL STUDENTS
*/
export const getTotalStudents = async () => {

  const query = `
    SELECT COUNT(*) AS total
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    WHERE u.role = 'student'
      AND u.is_blacklisted = 0
  `;

  const [rows] = await db.execute(query);

  return rows[0].total;
};



/*
LEADERBOARD STUDENTS (PAGINATION)
*/
export const getLeaderboardStudents = async (options = {}) => {

  let { limit = 10, offset = 0 } = options;

  limit = parseInt(limit);
  offset = parseInt(offset);

  if (isNaN(limit) || limit <= 0) limit = 10;
  if (isNaN(offset) || offset < 0) offset = 0;

  const query = `
    SELECT
      u.user_id,
      u.full_name,
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
    ORDER BY
      sp.total_score DESC,
      sp.programs_solved DESC,
      sp.updated_at ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [rows] = await db.execute(query);

  return rows;
};



/*
TOP STUDENTS
*/
export const getTopStudents = async (limit = 10) => {

  limit = parseInt(limit);

  if (isNaN(limit) || limit <= 0) limit = 10;

  const query = `
    SELECT
      u.user_id,
      u.full_name,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    WHERE u.role = 'student'
      AND u.is_blacklisted = 0
    ORDER BY
      sp.total_score DESC,
      sp.programs_solved DESC,
      sp.updated_at ASC
    LIMIT ${limit}
  `;

  const [rows] = await db.execute(query);

  return rows;
};