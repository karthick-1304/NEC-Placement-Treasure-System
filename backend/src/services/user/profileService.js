import { query } from "../../utils/db.js";
import {
  GET_PRIVATE_PROFILE,
  GET_PUBLIC_PROFILE,
  GET_RECENT_SOLVES,
} from "../../queries/user/profileQueries.js";


/* ==============================================
   Private profile (logged-in user)
============================================== */
export const getPrivateProfile = async (userId) => {

  const rows = await query(GET_PRIVATE_PROFILE, [userId]);

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0];
};


/* ==============================================
   Public profile
============================================== */
export const getPublicProfile = async (userId) => {

  const rows = await query(GET_PUBLIC_PROFILE, [userId]);

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0];
};


/* ==============================================
   Recent solved problems
============================================== */
export const getRecentSolvedPrograms = async (userId) => {

  const rows = await query(GET_RECENT_SOLVES, [userId]);

  return rows || [];

};