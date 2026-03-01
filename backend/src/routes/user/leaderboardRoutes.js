import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getLeaderboard, getTopStudents } 
from "../../controllers/user/leaderboardController.js";

const router = express.Router();

router.get("/", protect, getLeaderboard);
router.get("/top", protect, getTopStudents);

export default router;