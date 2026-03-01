import { query } from '../../utils/db.js';
import {
  GET_PRIVATE_PROFILE,
  GET_PUBLIC_PROFILE,
  GET_RECENT_SOLVES,
} from '../../queries/user/profileQueries.js';

export const getPrivateProfile = async (userId) => {
  const rows = await query(GET_PRIVATE_PROFILE, [userId]);
  return rows[0] || null;
};

export const getPublicProfile = async (userId) => {
  const rows = await query(GET_PUBLIC_PROFILE, [userId]);
  return rows[0] || null;
};

export const getRecentSolvedPrograms = async (userId) => {
  const rows = await query(GET_RECENT_SOLVES, [userId]);
  return rows;
};