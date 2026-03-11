import express from "express";
import protect from "../../middleware/authMiddleware.js";
import { getUserStreak } from "../../controllers/user/streakController.js";

const router = express.Router();

router.get("/", protect, getUserStreak);

export default router;