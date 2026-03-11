// src/services/progressService.js

import {
  getWeeklyTrendQuery,
  getMonthlyTrendQuery,
  getActiveDaysLast30Query,
  getTotalSolvedProgramsQuery
} from "../../queries/user/progressQueries.js";

/**
 * Helper: convert month number to label
 */
const monthLabels = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

/**
 * Build milestone flags
 */
const buildMilestones = (totalSolved) => {
  return {
    first_problem: totalSolved >= 1,
    ten_problems: totalSolved >= 10,
    fifty_problems: totalSolved >= 50,
    hundred_problems: totalSolved >= 100
  };
};

/**
 * Calculate consistency score
 */
const calculateConsistency = (activeDays) => {
  const score = (activeDays / 30) * 100;
  return Math.round(score);
};

/**
 * Format weekly trend data
 */
const formatWeeklyTrend = (rows) => {
  return rows.map((row) => ({
    week: `Week ${row.week_number}`,
    solved: row.solved_count
  }));
};

/**
 * Format monthly trend data
 */
const formatMonthlyTrend = (rows) => {
  return rows.map((row) => ({
    month: monthLabels[row.month_number],
    solved: row.solved_count
  }));
};

/**
 * Main analytics service
 */
export const getProgressAnalyticsService = async (
  userId,
  year,
  month
) => {

  /* Fetch raw data from DB */

  const weeklyRows = await getWeeklyTrendQuery(userId, year, month);

  const monthlyRows = await getMonthlyTrendQuery(userId, year);

  const activeDaysData = await getActiveDaysLast30Query(userId);

  const solvedData = await getTotalSolvedProgramsQuery(userId);


  /* Calculations */

  const activeDays = activeDaysData?.active_days ?? 0;

  const totalSolved = solvedData?.total_solved ?? 0;

  const consistencyScore = calculateConsistency(activeDays);

  const milestones = buildMilestones(totalSolved);


  /* Format chart data */

  const weeklyTrend = formatWeeklyTrend(weeklyRows);

  const monthlyTrend = formatMonthlyTrend(monthlyRows);


  /* Final response object */

  return {
    weekly_trend: weeklyTrend,
    monthly_trend: monthlyTrend,
    consistency_score: consistencyScore,
    milestones,
    total_solved: totalSolved
  };
};