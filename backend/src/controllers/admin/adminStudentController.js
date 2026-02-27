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
export const createStudent = catchAsync(async (req, res, next) => {
  const result = await createStudentService(req.body);

  res.status(201).json({
    status: "success",
    message: result.message
  });
});

/**
 * 📄 Get All Students (Admin)
 */
export const getAllStudents = catchAsync(async (req, res, next) => {
  const students = await getAllStudentsService(req.query);

  res.status(200).json({
    status: "success",
    results: students.length,
    data: students
  });
});

/**
 * 🔍 Get Single Student (Admin)
 */
export const getStudentById = catchAsync(async (req, res, next) => {
  const student = await getStudentByIdService(
    Number(req.params.studentId)
  );

  res.status(200).json({
    status: "success",
    data: student
  });
});

/**
 * ✏️ Update Student (Admin)
 */
export const updateStudent = catchAsync(async (req, res, next) => {
  const result = await updateStudentService(
    Number(req.params.studentId),
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
export const deleteStudent = catchAsync(async (req, res, next) => {
  const result = await deleteStudentService(
    Number(req.params.studentId)
  );

  res.status(200).json({
    status: "success",
    message: result.message
  });
});