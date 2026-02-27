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
 * 🔎 Get Student By Register Number
 */
export const getStudentByRegisterNumber = async (registerNumber) => {
  return await query(
    `SELECT s.student_id
     FROM students s
     WHERE s.register_number = ?`,
    [registerNumber]
  );
};

/**
 * ➕ Create User (Student Role)
 */
export const createUser = async (fullName, email, hashedPassword, role) => {
  return await query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [fullName, email, hashedPassword, role]
  );
};

/**
 * ➕ Create Student Profile
 */
export const createStudentProfile = async (
  userId,
  registerNumber,
  departmentId,
  year,
  cgpa,
  phone
) => {
  return await query(
    `INSERT INTO students 
      (user_id, register_number, department_id, year, cgpa, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, registerNumber, departmentId, year, cgpa, phone]
  );
};

/**
 * 📄 Get All Students (With Filters & Pagination)
 */
export const getAllStudents = async ({
  departmentId,
  year,
  minCgpa,
  maxCgpa,
  offset,
  limit
}) => {
  let sql = `
    SELECT 
      s.student_id,
      u.user_id,
      u.full_name,
      u.email,
      s.register_number,
      s.department_id,
      s.year,
      s.cgpa,
      s.phone,
      u.is_blacklisted,
      s.created_at
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE 1=1
  `;

  const params = [];

  if (departmentId) {
    sql += ` AND s.department_id = ?`;
    params.push(departmentId);
  }

  if (year) {
    sql += ` AND s.year = ?`;
    params.push(year);
  }

  if (minCgpa) {
    sql += ` AND s.cgpa >= ?`;
    params.push(minCgpa);
  }

  if (maxCgpa) {
    sql += ` AND s.cgpa <= ?`;
    params.push(maxCgpa);
  }

  sql += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return await query(sql, params);
};

/**
 * 🔍 Get Student By ID
 */
export const getStudentById = async (studentId) => {
  return await query(
    `SELECT 
      s.student_id,
      u.user_id,
      u.full_name,
      u.email,
      s.register_number,
      s.department_id,
      s.year,
      s.cgpa,
      s.phone,
      u.is_blacklisted
     FROM students s
     JOIN users u ON s.user_id = u.user_id
     WHERE s.student_id = ?`,
    [studentId]
  );
};

/**
 * ✏️ Update Student
 */
export const updateStudent = async (studentId, fields, values) => {
  const sql = `
    UPDATE students
    SET ${fields}
    WHERE student_id = ?
  `;

  return await query(sql, [...values, studentId]);
};

/**
 * ✏️ Update User (Blacklist / Email etc.)
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
 * ❌ Delete Student (Hard Delete)
 */
export const deleteStudent = async (studentId) => {
  return await query(
    `DELETE FROM students WHERE student_id = ?`,
    [studentId]
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