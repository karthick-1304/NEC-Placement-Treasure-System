/**
 * Coding Question Difficulty Levels
 * Centralized definition to avoid hardcoded strings
 */

export const DIFFICULTY = Object.freeze({
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
});

/**
 * Array version (useful for validation)
 */
export const DIFFICULTY_LIST = Object.freeze(
  Object.values(DIFFICULTY)
);