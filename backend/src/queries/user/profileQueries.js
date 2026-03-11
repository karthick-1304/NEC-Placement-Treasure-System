// src/queries/profileQueries.js

/* =====================================================
   Private Profile Query (for /profile/me)
   Includes email + role
===================================================== */
// src/queries/profileQueries.js

export const GET_PRIVATE_PROFILE = `
SELECT
  u.user_id,
  u.full_name,
  u.email,

  sp.reg_no,
  sp.batch_year,
  sp.global_rank,
  sp.total_score,

  COUNT(DISTINCT sprog.prog_id) AS programs_solved

FROM users u

JOIN student_profiles sp
ON u.user_id = sp.user_id

LEFT JOIN solved_programs sprog
ON u.user_id = sprog.student_user_id

WHERE u.user_id = ?

GROUP BY
  u.user_id,
  u.full_name,
  u.email,
  sp.reg_no,
  sp.batch_year,
  sp.global_rank,
  sp.total_score
`;


/* =====================================================
   Public Profile Query (for /profile/:userId)
   Does NOT expose email
===================================================== */
export const GET_PUBLIC_PROFILE = `
SELECT
  u.user_id,
  u.full_name,

  sp.reg_no,
  sp.batch_year,
  sp.global_rank,
  sp.total_score,

  COUNT(DISTINCT sprog.prog_id) AS programs_solved

FROM users u

JOIN student_profiles sp
ON u.user_id = sp.user_id

LEFT JOIN solved_programs sprog
ON u.user_id = sprog.student_user_id

WHERE u.user_id = ?

GROUP BY
  u.user_id,
  u.full_name,
  sp.reg_no,
  sp.batch_year,
  sp.global_rank,
  sp.total_score
`;


/* =====================================================
   Recent Solved Programs Query
===================================================== */
export const GET_RECENT_SOLVES = `
  SELECT 
      p.prog_id,
      p.title,
      p.difficulty,
      sp.solved_at
  FROM solved_programs sp
  INNER JOIN programs p 
      ON p.prog_id = sp.prog_id
  WHERE sp.student_user_id = ?
  ORDER BY sp.solved_at DESC
  LIMIT 10
`;