// backend/src/services/admin/adminDashboardService.js

import {
  getTotalStudents,
  getTotalCompanies,
  getTotalPrograms,
  getTotalFeedback,
  getRecentStudents,
  getRecentCompanies,
  getTopStudents,
  getMonthlyRegistrations
} from "../../queries/admin/adminDashboardQueries.js";

/**
 * 📊 Get Complete Admin Dashboard Data
 */
export const getAdminDashboardService = async () => {
  // 1️⃣ Fetch all dashboard data in parallel
  const [
    totalStudents,
    totalCompanies,
    totalQuestions,
    totalFeedback,
    recentStudents,
    recentCompanies,
    topStudents,
    monthlyRegistrations
  ] = await Promise.all([
    getTotalStudents(),
    getTotalCompanies(),
    getTotalPrograms(),
    getTotalFeedback(),
    getRecentStudents(),
    getRecentCompanies(),
    getTopStudents(),
    getMonthlyRegistrations()
  ]);

  // 2️⃣ Structure Response
  return {
    stats: {
      totalStudents: totalStudents[0]?.total_students || 0,
      totalCompanies: totalCompanies[0]?.total_companies || 0,
      totalQuestions: totalQuestions[0]?.total_questions || 0,
      totalFeedback: totalFeedback[0]?.total_feedback || 0
    },
    recent: {
      students: recentStudents,
      companies: recentCompanies
    },
    leaderboard: {
      topStudents
    },
    analytics: {
      monthlyRegistrations
    }
  };
};