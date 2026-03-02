// backend/src/services/admin/adminBulkUploadService.js

import bcrypt from "bcryptjs";
import AppError from "../../utils/appError.js";

import {
  insertStudentUser,
  insertStudentProfile,
  insertProgram,
  insertCompany,
  checkStudentByEmail,
  checkProgramByTitle,
  checkCompanyByName
} from "../../queries/admin/adminBulkUploadQueries.js";

/* ============================
   👨‍🎓 BULK STUDENT UPLOAD
============================ */

export const bulkUploadStudentsService = async (students) => {
  if (!students?.length) {
    throw new AppError("No student data provided", 400);
  }

  const results = { inserted: 0, skipped: 0 };

  for (const student of students) {
    const {
      full_name,
      email,
      password,
      dept_id,
      batch_year,
      reg_no
    } = student;

    const existing = await checkStudentByEmail(email);
    if (existing.length) {
      results.skipped++;
      continue;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await insertStudentUser(
      full_name,
      email,
      hashedPassword,
      dept_id
    );

    const userId = userResult.insertId;

    await insertStudentProfile(
      userId,
      dept_id,
      batch_year,
      reg_no
    );

    results.inserted++;
  }

  return {
    message: "Student bulk upload completed",
    ...results
  };
};

/* ============================
   💻 BULK PROGRAM UPLOAD
============================ */

export const bulkUploadProgramsService = async (programs) => {
  if (!programs?.length) {
    throw new AppError("No program data provided", 400);
  }

  const results = { inserted: 0, skipped: 0 };

  for (const program of programs) {
    const { title, description, difficulty } = program;

    const existing = await checkProgramByTitle(title);
    if (existing.length) {
      results.skipped++;
      continue;
    }

    await insertProgram(title, description, difficulty);
    results.inserted++;
  }

  return {
    message: "Program bulk upload completed",
    ...results
  };
};

/* ============================
   🏢 BULK COMPANY UPLOAD
============================ */

export const bulkUploadCompaniesService = async (companies) => {
  if (!companies?.length) {
    throw new AppError("No company data provided", 400);
  }

  const results = { inserted: 0, skipped: 0 };

  for (const company of companies) {
    const { company_name, location, logo_url } = company;

    const existing = await checkCompanyByName(company_name);
    if (existing.length) {
      results.skipped++;
      continue;
    }

    await insertCompany(company_name, location, logo_url);
    results.inserted++;
  }

  return {
    message: "Company bulk upload completed",
    ...results
  };
};