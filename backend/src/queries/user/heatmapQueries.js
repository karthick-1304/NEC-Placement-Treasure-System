// Activity heatmap for selected window (used by controller)

export const GET_HEATMAP_WINDOW = `
SELECT 
  DATE(solved_at) AS date,
  COUNT(*) AS count
FROM solved_programs
WHERE student_user_id = ?
AND DATE(solved_at) BETWEEN ? AND ?
GROUP BY DATE(solved_at)
ORDER BY DATE(solved_at)
`;


// Optional: Full 365 day activity (not required but useful later)

export const GET_ACTIVITY_HEATMAP = `
SELECT
  DATE(solved_at) AS date,
  COUNT(*) AS count
FROM solved_programs
WHERE student_user_id = ?
AND solved_at >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)
GROUP BY DATE(solved_at)
ORDER BY DATE(solved_at)
`;