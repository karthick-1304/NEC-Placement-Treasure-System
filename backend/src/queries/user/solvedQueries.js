/* =====================================================
   GET FULL SOLVED PROGRAMS (Pagination)
===================================================== */

export const GET_SOLVED_PROGRAMS = `
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

LIMIT ? OFFSET ?
`;


/* =====================================================
   COUNT TOTAL SOLVED PROGRAMS
===================================================== */

export const COUNT_SOLVED_PROGRAMS = `
SELECT COUNT(*) AS total
FROM solved_programs
WHERE student_user_id = ?
`;