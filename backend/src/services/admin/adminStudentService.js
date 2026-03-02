// src/services/admin/adminStudentService.js

import bcrypt from "bcryptjs";
import AppError from "../../utils/appError.js";
import pool from "../../utils/db.js"; // ⚠️ import pool directly
import { ROLES } from "../../constants/roles.js";

import {
  getStudentByEmail,
  getStudentByRegNo,
  createUser,
  createStudentProfile,
  getAllStudents,
  getStudentById,
  updateStudentProfile,
  updateUser,
  deleteStudentProfile,
  deleteUser
} from "../../queries/admin/adminStudentQueries.js";

/**
 * ➕ Create Student (Admin)
 */
export const createStudentService = async (data) => {
  const {
    full_name,
    email,
    password,
    reg_no,
    dept_id,
    batch_year
  } = data;

  // 1️⃣ Check email
  const existingUser = await getStudentByEmail(email);
  if (existingUser.length) {
    throw new AppError("Email already exists.", 400);
  }

  // 2️⃣ Check reg_no
  const existingReg = await getStudentByRegNo(reg_no);
  if (existingReg.length) {
    throw new AppError("Register number already exists.", 400);
  }

  // 3️⃣ Validate department
  const [dept] = await pool.execute(
    `SELECT dept_id FROM depts WHERE dept_id = ? AND is_active = 1`,
    [dept_id]
  );

  if (!dept.length) {
    throw new AppError("Invalid or inactive department.", 400);
  }

  // 4️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 5️⃣ Create user
   const [userResult] = await connection.execute(
  `INSERT INTO users (full_name, email, password_hash, role)
   VALUES (?, ?, ?, ?)`,
  [full_name, email, hashedPassword, ROLES.STUDENT]
  );

    const userId = userResult.insertId;

    // 6️⃣ Create student profile
    await connection.execute(
      `INSERT INTO student_profiles (user_id, reg_no, dept_id, batch_year)
       VALUES (?, ?, ?, ?)`,
      [userId, reg_no, dept_id, batch_year]
    );

    await connection.commit();

    return { message: "Student created successfully." };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * 📄 Get All Students
 */
export const getAllStudentsService = async (filters) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const offset = (page - 1) * limit;

  return await getAllStudents({
    deptId: filters.dept_id,
    batchYear: filters.batch_year,
    offset,
    limit
  });
};

/**
 * 🔍 Get Student By ID
 */
export const getStudentByIdService = async (userId) => {
  const student = await getStudentById(userId);

  if (!student.length) {
    throw new AppError("Student not found.", 404);
  }

  return student[0];
};

/**
 * ✏️ Update Student
 */
export const updateStudentService = async (userId, data) => {
  const student = await getStudentById(userId);
  if (!student.length) {
    throw new AppError("Student not found.", 404);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update user table
    if (data.full_name || data.email || typeof data.is_blacklisted === "boolean") {
      const userFields = [];
      const userValues = [];

      if (data.full_name) {
        userFields.push("full_name = ?");
        userValues.push(data.full_name);
      }

      if (data.email) {
        userFields.push("email = ?");
        userValues.push(data.email);
      }

      if (typeof data.is_blacklisted === "boolean") {
        userFields.push("is_blacklisted = ?");
        userValues.push(data.is_blacklisted);
      }

      await connection.execute(
        `UPDATE users SET ${userFields.join(", ")} WHERE user_id = ?`,
        [...userValues, userId]
      );
    }

    // Update profile table
    if (data.reg_no || data.dept_id || data.batch_year) {
      const profileFields = [];
      const profileValues = [];

      if (data.reg_no) {
        profileFields.push("reg_no = ?");
        profileValues.push(data.reg_no);
      }

      if (data.dept_id) {
        profileFields.push("dept_id = ?");
        profileValues.push(data.dept_id);
      }

      if (data.batch_year) {
        profileFields.push("batch_year = ?");
        profileValues.push(data.batch_year);
      }

      await connection.execute(
        `UPDATE student_profiles SET ${profileFields.join(", ")} WHERE user_id = ?`,
        [...profileValues, userId]
      );
    }

    await connection.commit();

    return { message: "Student updated successfully." };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * ❌ Delete Student
 */
export const deleteStudentService = async (userId) => {
  const student = await getStudentById(userId);

  if (!student.length) {
    throw new AppError("Student not found.", 404);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM student_profiles WHERE user_id = ?`,
      [userId]
    );

    await connection.execute(
      `DELETE FROM users WHERE user_id = ?`,
      [userId]
    );

    await connection.commit();

    return { message: "Student deleted successfully." };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};