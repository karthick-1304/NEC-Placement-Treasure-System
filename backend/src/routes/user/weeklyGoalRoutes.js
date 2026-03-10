import express from "express";

import { protect } from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";

import {
  getWeeklyGoal,
  updateWeeklyGoal
} from "../../controllers/user/weeklyGoalController.js";

const router = express.Router();

/*
-------------------------------------------------------
GET Weekly Goal Progress
-------------------------------------------------------
Route:
GET /api/progress/weekly-goal

Access:
Student only
-------------------------------------------------------
*/
router.get(
  "/weekly-goal",
  protect,
  restrictTo("student"),
  getWeeklyGoal
);


/*
-------------------------------------------------------
Update Weekly Goal
-------------------------------------------------------
Route:
PUT /api/progress/weekly-goal

Body:
{
  "goal": 8
}
-------------------------------------------------------
*/
router.put(
  "/weekly-goal",
  protect,
  restrictTo("student"),
  updateWeeklyGoal
);

export default router;