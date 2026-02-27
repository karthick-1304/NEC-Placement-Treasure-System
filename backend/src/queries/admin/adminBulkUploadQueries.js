// backend/src/queries/admin/adminBulkUploadQueries.js

import { query } from "../../utils/db.js";

/**
 * 👨‍🎓 Insert Single Student (Used for Bulk Insert Loop)
 */
export const insertStudent = async (
  fullName,
  email,
  password,
  deptId,
  role = "student"
) => {
  return await query(
    `INSERT INTO users 
      (full_name, email, password, dept_id, role)
     VALUES (?, ?, ?, ?, ?)`,
    [fullName, email, password, deptId, role]
  );
};

/**
 * 📚 Insert Single Question (Used for Bulk Insert Loop)
 */
export const insertQuestion = async (
  title,
  description,
  difficulty,
  categoryId,
  companyId,
  marks,
  isActive = true
) => {
  return await query(
    `INSERT INTO questions
      (title, description, difficulty, category_id, company_id, marks, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      difficulty,
      categoryId,
      companyId,
      marks,
      isActive
    ]
  );
};

/**
 * 🏢 Insert Single Company (Used for Bulk Insert Loop)
 */
export const insertCompany = async (
  name,
  description,
  packageValue,
  eligibilityCgpa,
  visitYear,
  roleOffered,
  location,
  website,
  logoPath,
  isActive = true
) => {
  return await query(
    `INSERT INTO companies
      (name, description, package, eligibility_cgpa, visit_year,
       role_offered, location, website, logo, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description,
      packageValue,
      eligibilityCgpa,
      visitYear,
      roleOffered,
      location,
      website,
      logoPath,
      isActive
    ]
  );
};

/**
 * 🔎 Check If Email Exists (Avoid Duplicate Students)
 */
export const checkStudentByEmail = async (email) => {
  return await query(
    `SELECT user_id FROM users WHERE email = ?`,
    [email]
  );
};

/**
 * 🔎 Check If Question Exists (Avoid Duplicate Questions)
 */
export const checkQuestionByTitle = async (title) => {
  return await query(
    `SELECT question_id FROM questions WHERE title = ?`,
    [title]
  );
};

/**
 * 🔎 Check If Company Exists (Avoid Duplicate Companies)
 */
export const checkCompanyByName = async (name) => {
  return await query(
    `SELECT company_id FROM companies WHERE name = ?`,
    [name]
  );
};