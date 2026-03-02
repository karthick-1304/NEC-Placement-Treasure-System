// backend/src/routes/admin/adminAnalyticsRoutes.js

import express from "express";
import { getAdminAnalytics } from "../../controllers/admin/adminAnalyticsController.js";
import { protect} from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * 🔐 Protect Admin Analytics Route
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * 📊 Analytics Overview
 */
router.get("/", getAdminAnalytics);

export default router;