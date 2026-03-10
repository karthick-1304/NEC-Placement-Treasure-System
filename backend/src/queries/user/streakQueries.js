export const GET_SOLVE_DATES = `
SELECT DISTINCT DATE(solved_at) AS solve_date
FROM solved_programs
WHERE student_user_id = ?
ORDER BY solve_date DESC
`;