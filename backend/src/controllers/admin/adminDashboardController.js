// backend/src/controllers/admin/adminDashboardController.js

import catchAsync from "../../utils/catchAsync.js";
import { getAdminDashboardService } from "../../services/admin/adminDashboardService.js";

/**
 * 📊 Get Admin Dashboard Overview
 */
export const getAdminDashboard = catchAsync(async (req, res) => {
  const dashboardData = await getAdminDashboardService();

  res.status(200).json({
    status: "success",
    data: dashboardData
  });
});