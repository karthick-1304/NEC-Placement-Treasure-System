// src/services/profileService.js

import { query } from '../utils/db.js';
import {
  GET_PRIVATE_PROFILE,
  GET_PUBLIC_PROFILE,
  GET_RECENT_SOLVES,
} from '../queries/profileQueries.js';

/* =====================================================
   Get Private Profile (for logged-in student)
===================================================== */
export const getPrivateProfile = async (userId) => {
  const rows = await query(GET_PRIVATE_PROFILE, [userId]);
  return rows[0] || null;
};


/* =====================================================
   Get Public Profile (for viewing other students)
===================================================== */
export const getPublicProfile = async (userId) => {
  const rows = await query(GET_PUBLIC_PROFILE, [userId]);
  return rows[0] || null;
};


/* =====================================================
   Get Recent Solved Programs
===================================================== */
export const getRecentSolvedPrograms = async (userId, limit = 10) => {
  const rows = await query(GET_RECENT_SOLVES, [userId, Number(limit)]);
  return rows;
};