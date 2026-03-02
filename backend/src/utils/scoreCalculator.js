// src/utils/scoreCalculator.js

/**
 * Difficulty → Score mapping
 * Modify here if scoring rules change
 */
const SCORE_MAP = {
  easy: 10,
  medium: 20,
  hard: 30,
};

/**
 * Get score for a given difficulty
 * @param {string} difficulty - easy | medium | hard
 * @returns {number}
 */
export const calculateScore = (difficulty) => {
  if (!difficulty) return 0;

  const normalized = String(difficulty).toLowerCase().trim();

  return SCORE_MAP[normalized] || 0;
};

/**
 * Optional: expose score map if needed elsewhere
 */
export const getScoreMap = () => ({ ...SCORE_MAP });