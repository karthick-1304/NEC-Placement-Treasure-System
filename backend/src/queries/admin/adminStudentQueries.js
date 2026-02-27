// src/queries/admin/adminStudentQueries.js

import { query } from "../../utils/db.js";

/**
 * 🔎 Get Student By Email
 */
export const getStudentByEmail = async (email) => {
  return await query(
    `SELECT user_id FROM users WHERE email = ?`,
    [email]
  );
};

/**
 * 🔎 Get Student By Register Number (reg_no)
 */
export const getStudentByRegNo = async (regNo) => {
  return await query(
    `SELECT user_id 
     FROM student_profiles 
     WHERE reg_no = ?`,
    [regNo]
  );
};

/**
 * ➕ Create User (Student Role)
 */
export const createUser = async (fullName, email, hashedPassword, role) => {
  return await query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [fullName, email, hashedPassword, role]
  );
};

/**
 * ➕ Create Student Profile
 */
export const createStudentProfile = async (
  userId,
  regNo,
  deptId,
  batchYear
) => {
  return await query(
    `INSERT INTO student_profiles
      (user_id, reg_no, dept_id, batch_year)
     VALUES (?, ?, ?, ?)`,
    [userId, regNo, deptId, batchYear]
  );
};

/**
 * 📄 Get All Students (With Filters & Pagination)
 */
export const getAllStudents = async ({
  deptId,
  batchYear,
  offset,
  limit
}) => {
  let sql = `
    SELECT 
      u.user_id,
      u.full_name,
      u.email,
      sp.reg_no,
      sp.dept_id,
      sp.batch_year,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank,
      u.is_blacklisted
    FROM student_profiles sp
    JOIN users u ON sp.user_id = u.user_id
    WHERE 1=1
  `;

  const params = [];

  if (deptId) {
    sql += ` AND sp.dept_id = ?`;
    params.push(deptId);
  }

  if (batchYear) {
    sql += ` AND sp.batch_year = ?`;
    params.push(batchYear);
  }

  sql += ` ORDER BY sp.user_id DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return await query(sql, params);
};

/**
 * 🔍 Get Student By ID (user_id)
 */
export const getStudentById = async (userId) => {
  return await query(
    `SELECT 
      u.user_id,
      u.full_name,
      u.email,
      sp.reg_no,
      sp.dept_id,
      sp.batch_year,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank,
      u.is_blacklisted
     FROM student_profiles sp
     JOIN users u ON sp.user_id = u.user_id
     WHERE sp.user_id = ?`,
    [userId]
  );
};

/**
 * ✏️ Update Student Profile
 */
export const updateStudentProfile = async (userId, fields, values) => {
  const sql = `
    UPDATE student_profiles
    SET ${fields}
    WHERE user_id = ?
  `;

  return await query(sql, [...values, userId]);
};

/**
 * ✏️ Update User
 */
export const updateUser = async (userId, fields, values) => {
  const sql = `
    UPDATE users
    SET ${fields}
    WHERE user_id = ?
  `;

  return await query(sql, [...values, userId]);
};

/**
 * ❌ Delete Student Profile
 */
export const deleteStudentProfile = async (userId) => {
  return await query(
    `DELETE FROM student_profiles WHERE user_id = ?`,
    [userId]
  );
};

/**
 * ❌ Delete User
 */
export const deleteUser = async (userId) => {
  return await query(
    `DELETE FROM users WHERE user_id = ?`,
    [userId]
  );
};