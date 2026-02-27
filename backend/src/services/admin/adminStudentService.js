// src/services/admin/adminStudentService.js

import bcrypt from "bcryptjs";
import AppError from "../../utils/appError.js";
import { query } from "../../utils/db.js";
import  {ROLES}  from "../../constants/roles.js";

import {
  getStudentByEmail,
  getStudentByRegisterNumber,
  createUser,
  createStudentProfile,
  getAllStudents,
  getStudentById,
  updateStudent,
  updateUser,
  deleteStudent,
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
    register_number,
    department_id,
    year,
    cgpa,
    phone
  } = data;

  // 1️⃣ Check if email already exists
  const existingUser = await getStudentByEmail(email);
  if (existingUser.length) {
    throw new AppError("Email already exists.", 400);
  }

  // 2️⃣ Check if register number exists
  const existingRegister = await getStudentByRegisterNumber(
    register_number
  );
  if (existingRegister.length) {
    throw new AppError("Register number already exists.", 400);
  }

  // 3️⃣ Validate department exists & active
  const dept = await query(
    `SELECT dept_id FROM depts WHERE dept_id = ? AND is_active = 1`,
    [department_id]
  );

  if (!dept.length) {
    throw new AppError("Invalid or inactive department.", 400);
  }

  // 4️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 5️⃣ Transaction Start
  await query("START TRANSACTION");

  try {
    // 6️⃣ Create user
    const userResult = await createUser(
      full_name,
      email,
      hashedPassword,
      ROLES.STUDENT
    );

    const userId = userResult.insertId;

    // 7️⃣ Create student profile
    await createStudentProfile(
      userId,
      register_number,
      department_id,
      year,
      cgpa,
      phone
    );

    // 8️⃣ Commit
    await query("COMMIT");

    return { message: "Student created successfully." };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

/**
 * 📄 Get All Students
 */
export const getAllStudentsService = async (filters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  return await getAllStudents({
    departmentId: filters.department_id,
    year: filters.year,
    minCgpa: filters.min_cgpa,
    maxCgpa: filters.max_cgpa,
    offset,
    limit
  });
};

/**
 * 🔍 Get Student By ID
 */
export const getStudentByIdService = async (studentId) => {
  const student = await getStudentById(studentId);

  if (!student.length) {
    throw new AppError("Student not found.", 404);
  }

  return student[0];
};

/**
 * ✏️ Update Student
 */
export const updateStudentService = async (studentId, data) => {
  const student = await getStudentById(studentId);
  if (!student.length) {
    throw new AppError("Student not found.", 404);
  }

  const studentFields = [];
  const studentValues = [];

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

  if (data.register_number) {
    studentFields.push("register_number = ?");
    studentValues.push(data.register_number);
  }

  if (data.department_id) {
    studentFields.push("department_id = ?");
    studentValues.push(data.department_id);
  }

  if (data.year) {
    studentFields.push("year = ?");
    studentValues.push(data.year);
  }

  if (data.cgpa) {
    studentFields.push("cgpa = ?");
    studentValues.push(data.cgpa);
  }

  if (data.phone) {
    studentFields.push("phone = ?");
    studentValues.push(data.phone);
  }

  await query("START TRANSACTION");

  try {
    if (studentFields.length) {
      await updateStudent(
        studentId,
        studentFields.join(", "),
        studentValues
      );
    }

    if (userFields.length) {
      await updateUser(
        student[0].user_id,
        userFields.join(", "),
        userValues
      );
    }

    await query("COMMIT");

    return { message: "Student updated successfully." };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

/**
 * ❌ Delete Student
 */
export const deleteStudentService = async (studentId) => {
  const student = await getStudentById(studentId);

  if (!student.length) {
    throw new AppError("Student not found.", 404);
  }

  await query("START TRANSACTION");

  try {
    await deleteStudent(studentId);
    await deleteUser(student[0].user_id);

    await query("COMMIT");

    return { message: "Student deleted successfully." };
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};