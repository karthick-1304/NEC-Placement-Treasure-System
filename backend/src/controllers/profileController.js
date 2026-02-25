// src/controllers/profileController.js

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

import {
  getPrivateProfile,
  getPublicProfile,
  getRecentSolvedPrograms,
} from '../services/profileService.js';


/* =====================================================
   GET /api/profile/me
   Logged-in student's profile
===================================================== */
export const getMyProfile = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated.', 401));
  }

  if (req.user.role !== 'student') {
    return next(new AppError('Only students have profiles.', 403));
  }

  const userId = req.user.user_id;

  const profile = await getPrivateProfile(userId);

  if (!profile) {
    return next(new AppError('Profile not found.', 404));
  }

  const recentSolves = await getRecentSolvedPrograms(userId);

  res.status(200).json({
    status: 'success',
    data: {
      profile,
      recent_solves: recentSolves,
    },
  });
});


/* =====================================================
   GET /api/profile/:userId
   Public student profile
===================================================== */
export const getStudentProfile = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const profile = await getPublicProfile(userId);

  if (!profile) {
    return next(new AppError('Student not found.', 404));
  }

  const recentSolves = await getRecentSolvedPrograms(userId);

  res.status(200).json({
    status: 'success',
    data: {
      profile,
      recent_solves: recentSolves,
    },
  });
});