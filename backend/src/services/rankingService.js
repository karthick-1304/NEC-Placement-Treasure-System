// src/services/rankingService.js

import { query } from '../utils/db.js';

/**
 * Recalculate global ranks for all students
 * Ranking logic:
 * 1. total_score DESC
 * 2. programs_solved DESC
 * 3. updated_at ASC
 */
export const recalculateGlobalRanks = async () => {
  await query(`
    UPDATE student_profiles sp
    JOIN (
      SELECT user_id,
             RANK() OVER (
               ORDER BY total_score DESC,
                        programs_solved DESC,
                        updated_at ASC
             ) AS new_rank
      FROM student_profiles
    ) ranked
    ON sp.user_id = ranked.user_id
    SET sp.global_rank = ranked.new_rank
  `);

  console.log('✅ Global ranks recalculated successfully');
};