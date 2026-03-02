// backend/src/routes/admin/adminDashboardRoutes.js

import express from "express";
import { getAdminDashboard } from "../../controllers/admin/adminDashboardController.js";
import { protect} from "../../middleware/authMiddleware.js";
import { restrictTo } from "../../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * 🔐 Protect Admin Dashboard Route
 * Only ADMIN can access
 */
router.use(protect);
router.use(restrictTo("admin"));

/**
 * 📊 Dashboard Overview
 */
router.get("/", getAdminDashboard);

export default router;