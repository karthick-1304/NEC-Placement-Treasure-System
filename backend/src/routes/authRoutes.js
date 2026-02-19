import express from 'express';
import { login, forgotPassword, verifyOTPAndResetPassword, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp-and-reset-password', verifyOTPAndResetPassword);

router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);

export default router;