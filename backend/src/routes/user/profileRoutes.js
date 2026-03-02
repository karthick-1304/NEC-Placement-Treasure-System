// src/routes/profileRoutes.js

import express from 'express';
import {
  getMyProfile,
  getStudentProfile,
} from '../../controllers/user/profileController.js';

import { protect } from '../../middleware/authMiddleware.js'; 
// Adjust path if your middleware location differs

const router = express.Router();

/* =====================================================
   GET /api/profile/me
   Requires authentication
===================================================== */
router.get('/me', protect, getMyProfile);


/* =====================================================
   GET /api/profile/:userId
   Public profile (no auth required)
===================================================== */
router.get('/:userId', getStudentProfile);


export default router;