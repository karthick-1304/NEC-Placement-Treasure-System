import {
  getWeeklyGoalAnalytics,
  upsertWeeklyGoal
} from "../../queries/user/weeklyGoalQueries.js";


/*
-------------------------------------------------------
GET Weekly Goal Progress
-------------------------------------------------------
Returns:
{
  goal: number,
  completed: number
}
-------------------------------------------------------
*/
export const getWeeklyGoal = async (req, res) => {
  try {

    const userId = req.user.user_id;

    const analytics = await getWeeklyGoalAnalytics(userId);

    return res.status(200).json({
      status: "success",
      data: {
        goal: analytics.goal,
        completed: analytics.completed
      }
    });

  } catch (error) {

    console.error("Get Weekly Goal Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch weekly goal"
    });

  }
};



/*
-------------------------------------------------------
Update Weekly Goal
-------------------------------------------------------
Body:
{
  goal: number
}
-------------------------------------------------------
*/
export const updateWeeklyGoal = async (req, res) => {

  try {

    const userId = req.user.user_id;

    let { goal } = req.body;

    goal = Number(goal);

    if (!goal || goal < 1) {
      return res.status(400).json({
        status: "error",
        message: "Goal must be a number greater than 0"
      });
    }

    // Update goal
    await upsertWeeklyGoal(userId, goal);

    // Fetch updated analytics
    const updatedData = await getWeeklyGoalAnalytics(userId);

    return res.status(200).json({
      status: "success",
      message: "Weekly goal updated successfully",
      data: updatedData
    });

  } catch (error) {

    console.error("Update Weekly Goal Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to update weekly goal"
    });

  }

};