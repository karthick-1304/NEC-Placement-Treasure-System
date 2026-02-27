// backend/src/services/admin/adminBulkUploadService.js

import bcrypt from "bcryptjs";
import AppError from "../../utils/appError.js";
import {
  insertStudent,
  insertQuestion,
  insertCompany,
  checkStudentByEmail,
  checkQuestionByTitle,
  checkCompanyByName
} from "../../queries/admin/adminBulkUploadQueries.js";

/**
 * 👨‍🎓 Bulk Upload Students
 */
export const bulkUploadStudentsService = async (students) => {
  if (!students || !students.length) {
    throw new AppError("No student data provided", 400);
  }

  const results = {
    inserted: 0,
    skipped: 0
  };

  for (const student of students) {
    const { full_name, email, password, dept_id } = student;

    const existing = await checkStudentByEmail(email);
    if (existing.length) {
      results.skipped++;
      continue;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await insertStudent(
      full_name,
      email,
      hashedPassword,
      dept_id
    );

    results.inserted++;
  }

  return {
    message: "Student bulk upload completed",
    ...results
  };
};

/**
 * ❓ Bulk Upload Questions
 */
export const bulkUploadQuestionsService = async (questions) => {
  if (!questions || !questions.length) {
    throw new AppError("No question data provided", 400);
  }

  const results = {
    inserted: 0,
    skipped: 0
  };

  for (const question of questions) {
    const {
      title,
      description,
      difficulty,
      category_id,
      company_id,
      marks
    } = question;

    const existing = await checkQuestionByTitle(title);
    if (existing.length) {
      results.skipped++;
      continue;
    }

    await insertQuestion(
      title,
      description,
      difficulty,
      category_id,
      company_id,
      marks
    );

    results.inserted++;
  }

  return {
    message: "Question bulk upload completed",
    ...results
  };
};

/**
 * 🏢 Bulk Upload Companies
 */
export const bulkUploadCompaniesService = async (companies) => {
  if (!companies || !companies.length) {
    throw new AppError("No company data provided", 400);
  }

  const results = {
    inserted: 0,
    skipped: 0
  };

  for (const company of companies) {
    const {
      name,
      description,
      package: packageValue,
      eligibility_cgpa,
      visit_year,
      role_offered,
      location,
      website,
      logo
    } = company;

    const existing = await checkCompanyByName(name);
    if (existing.length) {
      results.skipped++;
      continue;
    }

    await insertCompany(
      name,
      description,
      packageValue,
      eligibility_cgpa,
      visit_year,
      role_offered,
      location,
      website,
      logo || null
    );

    results.inserted++;
  }

  return {
    message: "Company bulk upload completed",
    ...results
  };
};