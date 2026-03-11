import express from "express";
import protect from "../../middleware/authMiddleware.js";
import { getHeatmapActivity } from "../../controllers/user/heatmapController.js";

const router = express.Router();

router.get("/", protect, getHeatmapActivity);

export default router;