// backend/src/queries/admin/adminBulkUploadQueries.js

import { query } from "../../utils/db.js";

/* ============================
   👨‍🎓 STUDENT INSERT
============================ */

// Insert into users
export const insertStudentUser = async (full_name, email, passwordHash) => {
  const sql = `
    INSERT INTO users
    (full_name, email, password_hash, role)
    VALUES (?, ?, ?, 'student')
  `;
  return await query(sql, [full_name, email, passwordHash]);
};

// Insert into student_profiles
export const insertStudentProfile = async (
  user_id,
  dept_id,
  batch_year,
  reg_no
) => {
  const sql = `
    INSERT INTO student_profiles
    (user_id, dept_id, batch_year, reg_no)
    VALUES (?, ?, ?, ?)
  `;
  return await query(sql, [user_id, dept_id, batch_year, reg_no]);
};

export const checkStudentByEmail = async (email) => {
  return await query(
    `SELECT user_id FROM users WHERE email = ?`,
    [email]
  );
};

/* ============================
   💻 PROGRAM INSERT
============================ */

export const insertProgram = async (
  title,
  description,
  difficulty,
  createdBy
) => {
  return await query(
    `INSERT INTO programs
     (title, description, difficulty, supported_languages)
     VALUES (?, ?, ?, JSON_ARRAY('java','cpp','python'))`,
    [title, description, difficulty]
  );
};

export const checkProgramByTitle = async (title) => {
  return await query(
    `SELECT prog_id FROM programs WHERE title = ?`,
    [title]
  );
};

/* ============================
   🏢 COMPANY INSERT
============================ */

export const insertCompany = async (
  companyName,
  location,
  logoUrl
) => {
  return await query(
    `INSERT INTO companies
     (company_name, location, logo_url, is_active)
     VALUES (?, ?, ?, 1)`,
    [companyName, location, logoUrl]
  );
};

export const checkCompanyByName = async (name) => {
  return await query(
    `SELECT company_id FROM companies WHERE company_name = ?`,
    [name]
  );
};