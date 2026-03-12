import express from "express";
import protect from "../../middleware/authMiddleware.js";
import { getHeatmapActivity } from "../../controllers/user/heatmapController.js";

const router = express.Router();

/*
  GET /stats/heatmap
  Query params:
  ?start=YYYY-MM-DD
  ?end=YYYY-MM-DD
*/

router.get("/", protect, getHeatmapActivity);

export default router;