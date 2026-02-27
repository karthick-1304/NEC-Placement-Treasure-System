// src/controllers/admin/adminStudentController.js

import catchAsync from "../../utils/catchAsync.js";

import {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentService,
  deleteStudentService
} from "../../services/admin/adminStudentService.js";

/**
 * ➕ Create Student (Admin)
 */
export const createStudent = catchAsync(async (req, res) => {
  const result = await createStudentService(req.body);

  res.status(201).json({
    status: "success",
    message: result.message
  });
});

/**
 * 📄 Get All Students (Admin)
 */
export const getAllStudents = catchAsync(async (req, res) => {
  const students = await getAllStudentsService(req.query);

  res.status(200).json({
    status: "success",
    results: students.length,
    data: students
  });
});

/**
 * 🔍 Get Single Student (Admin)
 * Now using user_id instead of student_id
 */
export const getStudentById = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);

  const student = await getStudentByIdService(userId);

  res.status(200).json({
    status: "success",
    data: student
  });
});

/**
 * ✏️ Update Student (Admin)
 */
export const updateStudent = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);

  const result = await updateStudentService(
    userId,
    req.body
  );

  res.status(200).json({
    status: "success",
    message: result.message
  });
});

/**
 * ❌ Delete Student (Admin)
 */
export const deleteStudent = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);

  const result = await deleteStudentService(userId);

  res.status(200).json({
    status: "success",
    message: result.message
  });
});