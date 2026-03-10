// src/routes/progressRoutes.js

import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getProgressExplorer } from "../../controllers/user/progressController.js";

const router = express.Router();

/**
 * Progress Explorer Analytics
 * GET /api/progress/explorer
 */
router.get("/explorer", protect, getProgressExplorer);

export default router;