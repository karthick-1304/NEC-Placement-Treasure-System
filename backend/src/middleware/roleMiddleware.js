// src/middlewares/roleMiddleware.js

import AppError from '../utils/appError.js';

/**
 * Restrict route to specific roles
 * Usage:
 *   restrictTo('admin')
 *   restrictTo('admin', 'teacher')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1️⃣ Check if user exists (protect middleware must run first)
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401));
    }

    // 2️⃣ Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Role "${req.user.role}" is not allowed.`,
          403
        )
      );
    }

    next();
  };
};