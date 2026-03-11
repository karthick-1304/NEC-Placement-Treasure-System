// src/services/admin/adminProgramService.js

import {
  createProgramQuery,
  getAllProgramsQuery,
  getProgramByIdQuery,
  updateProgramQuery,
  deleteProgramQuery,
  countProgramsQuery,
  insertPublicTestcaseQuery,
  insertPrivateTestcaseQuery
} from "../../queries/admin/adminProgramQueries.js";

/**
 * ➕ Create Program Service
 */
export const createProgramService = async (data, adminId) => {
  const {
    title,
    description,
    difficulty,
    constraints_text,
    time_limit_ms,
    memory_limit_mb,
    supported_languages,
    public_testcase_count,
    private_testcase_count,
    publicTestcases = [],
    privateTestcases = []
  } = data;

  // 1️⃣ Insert program
  const result = await createProgramQuery(
    title,
    description,
    difficulty,
    constraints_text,
    time_limit_ms,
    memory_limit_mb,
    supported_languages,
    public_testcase_count,
    private_testcase_count,
    adminId
  );

  const programId = result.insertId;
  console.log("NEW PROGRAM ID:", programId);

console.log("PUBLIC TESTCASES RECEIVED:", publicTestcases);
console.log("PRIVATE TESTCASES RECEIVED:", privateTestcases);

  // 2️⃣ Insert testcases

  let order = 1;

  // Public testcases
  for (const tc of publicTestcases) {
    await insertPublicTestcaseQuery(
      programId,
      tc.input,
      tc.output,
      order++
    );
  }
  
  // Private testcases
  for (const tc of privateTestcases) {
    await insertPrivateTestcaseQuery(
      programId,
      tc.input,
      tc.output,
      order++
    );
  }

  return {
    message: "Program created successfully",
    programId
  };
};
/**
 * 📄 Get All Programs Service
 */
export const getAllProgramsService = async (filters) => {

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;

  const programs = await getAllProgramsQuery(filters);
  const total = await countProgramsQuery(filters.difficulty);

  return {
    page,
    totalPages: Math.ceil(total / limit),
    results: programs.length,
    data: programs
  };
};
/**
 * 🔍 Get Program By ID Service
 */
export const getProgramByIdService = async (progId) => {
  const rows = await getProgramByIdQuery(progId);

  if (rows.length === 0) {
    throw new Error("Program not found");
  }

  return rows[0];
};

/**
 * ✏️ Update Program Service
 */
export const updateProgramService = async (progId, data) => {
  const fields = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  await updateProgramQuery(
    progId,
    fields.join(", "),
    values
  );

  return { message: "Program updated successfully" };
};

/**
 * ❌ Delete Program Service
 */
export const deleteProgramService = async (progId) => {
  await deleteProgramQuery(progId);
  return { message: "Program deleted successfully" };
};