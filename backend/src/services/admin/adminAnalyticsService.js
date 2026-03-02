import {
  getStudentsByDepartment,
  getProgramsByDifficulty,
  getCompanyCount,
  getAverageScoreByDepartment,
  getSelectionStats,
  getMonthlyProgramTrend
} from "../../queries/admin/adminAnalyticsQueries.js";

export const getAdminAnalyticsService = async () => {
  const [
    studentsByDepartment,
    programsByDifficulty,
    companyCount,
    averageScoreByDepartment,
    selectionStats,
    monthlyProgramTrend
  ] = await Promise.all([
    getStudentsByDepartment(),
    getProgramsByDifficulty(),
    getCompanyCount(),
    getAverageScoreByDepartment(),
    getSelectionStats(),
    getMonthlyProgramTrend()
  ]);

  return {
    departmentAnalytics: {
      studentsByDepartment,
      averageScoreByDepartment
    },
    programAnalytics: {
      programsByDifficulty,
      monthlyProgramTrend
    },
    companyAnalytics: {
      companyCount
    },
    placementAnalytics: {
      selectionStats
    }
  };
};