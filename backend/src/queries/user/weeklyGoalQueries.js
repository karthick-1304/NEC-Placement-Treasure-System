import db from "../../utils/db.js";

/*
-------------------------------------------------------
1. Get User Weekly Goal
-------------------------------------------------------
Returns the goal set by the user.
If the user never set a goal, we return default = 5.
-------------------------------------------------------
*/
export const getWeeklyGoal = async (userId) => {

  const [rows] = await db.execute(
    `
    SELECT goal_count
    FROM weekly_goals
    WHERE user_id = ?
    `,
    [userId]
  );

  if (rows.length === 0) {
    return 5;
  }

  return rows[0].goal_count;
};


/*
-------------------------------------------------------
2. Insert or Update Weekly Goal
-------------------------------------------------------
If goal exists -> update
If not -> insert
-------------------------------------------------------
*/
export const upsertWeeklyGoal = async (userId, goalCount) => {

  await db.execute(
    `
    INSERT INTO weekly_goals (user_id, goal_count)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      goal_count = VALUES(goal_count)
    `,
    [userId, goalCount]
  );

};



/*
-------------------------------------------------------
3. Get Weekly Goal Progress
-------------------------------------------------------
Counts how many problems solved this week
-------------------------------------------------------
*/
export const getWeeklyGoalProgress = async (userId) => {

  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS solved_this_week
    FROM solved_programs
    WHERE student_user_id = ?
    AND solved_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `,
    [userId]
  );

  return rows[0].solved_this_week;
};


/*
-------------------------------------------------------
4. Get Full Weekly Goal Analytics
-------------------------------------------------------
Used in Progress Explorer
Returns:
{
 goal: number,
 completed: number
}
-------------------------------------------------------
*/
export const getWeeklyGoalAnalytics = async (userId) => {

  const goal = await getWeeklyGoal(userId);

  const completed = await getWeeklyGoalProgress(userId);

  return {
    goal,
    completed
  };

};
export const getWeeklyCompleted = async (userId) => {

  const [rows] = await pool.execute(
    `
    SELECT COUNT(*) AS completed
    FROM solved_programs
    WHERE student_user_id = ?
    AND solved_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `,
    [userId]
  );

  return rows[0].completed;
};