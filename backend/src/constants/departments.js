/**
 * Department-related constants
 * Since departments are stored in DB, 
 * this file only contains field names and status flags.
 */

const DEPARTMENT_STATUS = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 0
});

module.exports = {
  DEPARTMENT_STATUS
};