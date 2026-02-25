// src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { query } from "../utils/db.js";

/**
 * Protect routes (Authentication)
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header or cookies
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to get access.",
        401
      )
    );
  }

  // 2️⃣ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3️⃣ Check if user still exists
  const users = await query(
    `SELECT u.user_id, u.full_name, u.email, u.role, u.is_blacklisted
     FROM users u
     WHERE u.user_id = ?`,
    [decoded.id]
  );

  if (!users.length) {
    return next(new AppError("User no longer exists.", 401));
  }

  const user = users[0];

  // 4️⃣ Check if user is blacklisted
  if (user.is_blacklisted) {
    return next(
      new AppError("Your account has been suspended. Contact admin.", 403)
    );
  }

  // 5️⃣ Attach user to request
  req.user = user;
  next();
});

/**
 * Role-based Authorization
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403
        )
      );
    }
    next();
  };
};

/**
 * ✅ Export both named and default
 */
export { protect, restrictTo };
export default protect;