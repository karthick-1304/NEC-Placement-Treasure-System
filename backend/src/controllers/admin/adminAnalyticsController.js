// backend/src/controllers/admin/adminAnalyticsController.js

import catchAsync from "../../utils/catchAsync.js";
import { getAdminAnalyticsService } from "../../services/admin/adminAnalyticsService.js";

/**
 * 📊 Get Admin Analytics Overview
 */
export const getAdminAnalytics = catchAsync(async (req, res) => {
  const analyticsData = await getAdminAnalyticsService();

  res.status(200).json({
    status: "success",
    data: analyticsData
  });
});