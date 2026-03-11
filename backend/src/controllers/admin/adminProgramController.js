// src/controllers/admin/adminProgramController.js

import catchAsync from "../../utils/catchAsync.js";
import {
  createProgramService,
  getAllProgramsService,
  getProgramByIdService,
  updateProgramService,
  deleteProgramService
} from "../../services/admin/adminProgramService.js";

/**
 * ➕ Create Program (Admin)
 */
export const createProgram = async (req, res) => {
  try {
    const result = await createProgramService(
      req.body,
      req.user.user_id   // logged-in admin
    );

    res.status(201).json(result);

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

/**
 * 📄 Get All Programs (Admin)
 */
export const getAllPrograms = catchAsync(async (req, res) => {
  const result = await getAllProgramsService(req.query);

  res.status(200).json({
    status: "success",
    ...result
  });
});

/**
 * 🔍 Get Single Program (Admin)
 */
export const getProgramById = catchAsync(async (req, res) => {
  const result = await getProgramByIdService(req.params.id);

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ✏️ Update Program (Admin)
 */
export const updateProgram = catchAsync(async (req, res) => {
  const result = await updateProgramService(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: result
  });
});

/**
 * ❌ Delete Program (Admin)
 */
export const deleteProgram = catchAsync(async (req, res) => {
  const result = await deleteProgramService(req.params.id);

  res.status(200).json({
    status: "success",
    data: result
  });
});