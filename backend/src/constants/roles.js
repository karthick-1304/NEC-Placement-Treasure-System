/**
 * Application Roles
 * Centralized role definitions to avoid hardcoded strings
 */

export const ROLES = Object.freeze({
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  STUDENT: "student",
  SUPER_ADMIN: "super_admin"
});

/**
 * Array version for validation purposes
 */
export const ROLE_LIST = Object.freeze(Object.values(ROLES));