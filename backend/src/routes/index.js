// src/routes/index.js

import express from "express";

import authRoutes from "./authRoutes.js";
import companyRoutes from "./companyRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import profileRoutes from "./profileRoutes.js";
import programRoutes from "./programRoutes.js";

import adminRoutes from "./admin/adminRoutes.js";

const router = express.Router();

/**
 * 🔐 Public / Auth Routes
 */
router.use("/auth", authRoutes);

/**
 * 🎓 Student / General Routes
 */
router.use("/companies", companyRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/profile", profileRoutes);
router.use("/programs", programRoutes);

/**
 * 🛠 Admin Routes (All Admin Modules Nested Inside)
 */
router.use("/admin", adminRoutes);

export default router;