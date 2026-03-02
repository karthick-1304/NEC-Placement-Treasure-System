// src/controllers/leaderboardController.js

import catchAsync from "../../utils/catchAsync.js";
import { fetchLeaderboard, fetchTopStudents } from "../../services/user/leaderboardService.js";

/**
 * @desc    Get leaderboard (with optional filters)
 * @route   GET /api/leaderboard
 * @query   page, limit, batch, dept
 */
export const getLeaderboard = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    batch,
    dept
  } = req.query;

  const result = await fetchLeaderboard({
    page: Number(page),
    limit: Number(limit),
    batch: batch ? Number(batch) : null,
    dept: dept ? Number(dept) : null
  });

  res.status(200).json({
    status: "success",
    page: Number(page),
    totalPages: result.totalPages,
    totalStudents: result.totalStudents,
    data: result.students
  });
});


/**
 * @desc    Get Top N students
 * @route   GET /api/leaderboard/top
 * @query   limit
 */
export const getTopStudents = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;

  const students = await fetchTopStudents(
    Number(limit)
  );

  res.status(200).json({
    status: "success",
    results: students.length,
    data: students
  });
});