import express from "express";
import { getDifficultyStats } from "../../controllers/user/statsController.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/difficulty", protect, getDifficultyStats);

export default router;