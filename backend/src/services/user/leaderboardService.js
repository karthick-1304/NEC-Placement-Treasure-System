// src/services/leaderboardService.js

import { 
  getTotalStudents, 
  getLeaderboardStudents, 
  getTopStudents 
} from "../../queries/user/leaderboardQueries.js";

/**
 * Fetch leaderboard with pagination and optional filters
 */
export const fetchLeaderboard = async ({ page, limit, batch, dept }) => {

  page = Number(page);
  limit = Number(limit);

  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  const totalStudents = await getTotalStudents({ batch, dept });

  const students = await getLeaderboardStudents({
    limit,
    offset,
    batch,
    dept
  });

  const totalPages = Math.ceil(totalStudents / limit);

  return {
    totalStudents,
    totalPages,
    students
  };
};


/**
 * Fetch Top N students globally
 */
export const fetchTopStudents = async (limit) => {
  const students = await getTopStudents(limit);
  return students;
};