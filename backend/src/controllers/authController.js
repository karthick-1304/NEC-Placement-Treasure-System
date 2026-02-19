import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { query, getConnection } from '../utils/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendOTPEmail } from '../utils/email.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user.user_id);

  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

const getProfileData = async (userId, role) => {
  if (role === 'student') {
    const rows = await query(
      `SELECT sp.dept_id, sp.batch_year, sp.reg_no, sp.global_rank, sp.total_score,
              d.dept_code, d.dept_name, sp.programs_solved
       FROM student_profiles sp
       JOIN depts d ON sp.dept_id = d.dept_id
       WHERE sp.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === 'staff') {
    const rows = await query(
      `SELECT sp.employee_code, sp.designation, sp.dept_id,
              d.dept_code, d.dept_name
       FROM staff_profiles sp
       JOIN depts d ON sp.dept_id = d.dept_id
       WHERE sp.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === 'dept_head') {
    const rows = await query(
      `SELECT dhp.dept_id, d.dept_code, d.dept_name
       FROM dept_head_profiles dhp
       JOIN depts d ON dhp.dept_id = d.dept_id
       WHERE dhp.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === 'admin') {
    const rows = await query(
      `SELECT has_full_crud_access FROM admin_profiles WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  return null;
};

// POST /api/auth/login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password.', 400));

  if (!validator.isEmail(email))
    return next(new AppError('Please provide a valid email address.', 400));

  const users = await query(
    `SELECT user_id, full_name, email, password_hash, role, is_blacklisted
     FROM users WHERE email = ?`,
    [email.toLowerCase().trim()]
  );

  if (!users.length)
    return next(new AppError('Invalid email or password.', 401));

  const user = users[0];

  if (user.is_blacklisted)
    return next(new AppError('Your account has been suspended. Please contact the administrator.', 403));

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordCorrect)
    return next(new AppError('Invalid email or password.', 401));

  await query(`UPDATE users SET last_login_at = NOW() WHERE user_id = ?`, [user.user_id]);

  const profileData = await getProfileData(user.user_id, user.role);

  const userPayload = {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    profile: profileData,
  };

  sendTokenResponse(userPayload, 200, res);
});

// POST /api/auth/forgot-password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError('Please provide your email address.', 400));
  if (!validator.isEmail(email)) return next(new AppError('Please provide a valid email address.', 400));

  const users = await query(
    `SELECT user_id, full_name, email FROM users WHERE email = ?`,
    [email.toLowerCase().trim()]
  );

  if (!users.length)
    return next(new AppError('No account found with that email address.', 404));

  const user = users[0];

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRES_IN) * 60 * 1000);

  // Delete old tokens for this user
  await query(`DELETE FROM password_reset_tokens WHERE user_id = ?`, [user.user_id]);

  // Insert new token
  await query(
    `INSERT INTO password_reset_tokens (user_id, otp_hash, expires_at) VALUES (?, ?, ?)`,
    [user.user_id, otpHash, expiresAt]
  );

  await sendOTPEmail({ to: user.email, name: user.full_name, otp });

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to your email address.',
    data: { user_id: user.user_id },
  });
});

// POST /api/auth/verify-otp-reset-password
export const verifyOTPAndResetPassword = catchAsync(async (req, res, next) => {
  const { user_id, otp, new_password, confirm_password } = req.body;

  if (!user_id || !otp || !new_password || !confirm_password)
    return next(new AppError('Please provide user_id, otp, new_password and confirm_password.', 400));

  if (new_password !== confirm_password)
    return next(new AppError('Passwords do not match.', 400));

  if (new_password.length < 8)
    return next(new AppError('Password must be at least 8 characters.', 400));

  const tokens = await query(
    `SELECT token_id, otp_hash, expires_at
     FROM password_reset_tokens
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [user_id]
  );

  if (!tokens.length)
    return next(new AppError('No OTP request found. Please request a new OTP.', 400));

  const tokenRecord = tokens[0];

  if (new Date() > new Date(tokenRecord.expires_at))
    return next(new AppError('OTP has expired. Please request a new one.', 400));

  const isOTPValid = await bcrypt.compare(otp.toString(), tokenRecord.otp_hash);
  if (!isOTPValid)
    return next(new AppError('Invalid OTP. Please try again.', 400));

  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    const hashedPassword = await bcrypt.hash(new_password, 12);

    await conn.execute(
      `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?`,
      [hashedPassword, user_id]
    );

    await conn.execute(
      `DELETE FROM password_reset_tokens WHERE user_id = ?`,
      [user_id]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully. Please log in.',
  });
});
// GET /api/auth/me
export const getMe = catchAsync(async (req, res, next) => {
  const profileData = await getProfileData(req.user.user_id, req.user.role);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        ...req.user,
        profile: profileData,
      },
    },
  });
});

// POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
};