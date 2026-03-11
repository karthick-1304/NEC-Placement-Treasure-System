// src/controllers/progressController.js

import { getProgressAnalyticsService } from "../../services/user/progressService.js";

/**
 * GET /api/progress/explorer
 * Returns analytics data for Progress Explorer page
 */
export const getProgressExplorer = async (req, res) => {
  try {
    // user id from auth middleware
    const userId = req.user.user_id;

    // optional query params
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    // call service
    const analytics = await getProgressAnalyticsService(userId, year, month);

    // response
    return res.status(200).json({
      status: "success",
      data: analytics
    });

  } catch (error) {
    console.error("Progress Explorer Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch progress analytics"
    });
  }
};