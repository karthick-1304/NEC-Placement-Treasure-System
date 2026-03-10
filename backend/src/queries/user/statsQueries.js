export const GET_DIFFICULTY_STATS = `
SELECT 
    p.difficulty,
    COUNT(*) as solved_count

FROM solved_programs sp

INNER JOIN programs p
    ON p.prog_id = sp.prog_id

WHERE sp.student_user_id = ?

GROUP BY p.difficulty
`;