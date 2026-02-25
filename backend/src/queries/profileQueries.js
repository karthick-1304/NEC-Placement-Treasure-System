// src/queries/profileQueries.js

/* =====================================================
   Private Profile Query (for /profile/me)
   Includes email + role
===================================================== */
export const GET_PRIVATE_PROFILE = `
  SELECT 
      u.user_id,
      u.name,
      u.email,
      u.role,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank,
      sp.created_at
  FROM users u
  INNER JOIN student_profiles sp 
      ON u.user_id = sp.user_id
  WHERE u.user_id = ?
`;


/* =====================================================
   Public Profile Query (for /profile/:userId)
   Does NOT expose email
===================================================== */
export const GET_PUBLIC_PROFILE = `
  SELECT 
      u.user_id,
      u.name,
      sp.total_score,
      sp.programs_solved,
      sp.global_rank,
      sp.created_at
  FROM users u
  INNER JOIN student_profiles sp 
      ON u.user_id = sp.user_id
  WHERE u.user_id = ?
`;


/* =====================================================
   Recent Solved Programs Query
===================================================== */
export const GET_RECENT_SOLVES = `
  SELECT 
      p.prog_id,
      p.title,
      p.difficulty,
      spv.solved_at
  FROM solved_programs spv
  INNER JOIN programs p 
      ON p.prog_id = spv.prog_id
  WHERE spv.student_user_id = ?
  ORDER BY spv.solved_at DESC
  LIMIT ?
`;