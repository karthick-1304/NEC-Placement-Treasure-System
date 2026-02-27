// backend/src/services/admin/adminAnalyticsService.js

import {
  getStudentsByDepartment,
  getQuestionsByDifficulty,
  getCompanyVisitsByYear,
  getAverageScoreByDepartment,
  getFeedbackRatingDistribution,
  getMonthlyQuestionTrend
} from "../../queries/admin/adminAnalyticsQueries.js";

/**
 * 📊 Get Complete Admin Analytics Data
 */
export const getAdminAnalyticsService = async () => {
  const [
    studentsByDepartment,
    questionsByDifficulty,
    companyVisitsByYear,
    averageScoreByDepartment,
    feedbackRatingDistribution,
    monthlyQuestionTrend
  ] = await Promise.all([
    getStudentsByDepartment(),
    getQuestionsByDifficulty(),
    getCompanyVisitsByYear(),
    getAverageScoreByDepartment(),
    getFeedbackRatingDistribution(),
    getMonthlyQuestionTrend()
  ]);

  return {
    departmentAnalytics: {
      studentsByDepartment,
      averageScoreByDepartment
    },
    questionAnalytics: {
      questionsByDifficulty,
      monthlyQuestionTrend
    },
    companyAnalytics: {
      companyVisitsByYear
    },
    feedbackAnalytics: {
      feedbackRatingDistribution
    }
  };
};