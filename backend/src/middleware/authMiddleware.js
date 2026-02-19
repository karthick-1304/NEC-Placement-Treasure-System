import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { query } from '../utils/db.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('You are not logged in. Please log in to get access.', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const users = await query(
    `SELECT u.user_id, u.full_name, u.email, u.role, u.is_blacklisted
     FROM users u
     WHERE u.user_id = ?`,
    [decoded.id]
  );

  if (!users.length) return next(new AppError('User no longer exists.', 401));

  const user = users[0];

  if (user.is_blacklisted) return next(new AppError('Your account has been suspended. Contact admin.', 403));

  req.user = user;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};