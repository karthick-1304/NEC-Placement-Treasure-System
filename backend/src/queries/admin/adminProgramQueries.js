// src/queries/admin/adminProgramQueries.js

import pool from "../../utils/db.js";

/**
 * ➕ Create Program
 */
export const createProgramQuery = async (
  title,
  description,
  difficulty,
  constraints_text,
  time_limit_ms,
  memory_limit_mb,
  supported_languages,
  public_testcase_count,
  private_testcase_count,
  created_by
) => {
  const [result] = await pool.execute(
    `
    INSERT INTO programs (
      title,
      description,
      difficulty,
      constraints_text,
      time_limit_ms,
      memory_limit_mb,
      supported_languages,
      public_testcase_count,
      private_testcase_count,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      description,
      difficulty,
      constraints_text,
      time_limit_ms,
      memory_limit_mb,
      JSON.stringify(supported_languages), // ✅ Always stringify for JSON column
      public_testcase_count,
      private_testcase_count,
      created_by
    ]
  );

  return result;
};

/**
 * 📄 Get All Programs (Filter + Pagination)
 */
export const getAllProgramsQuery = async ({
  difficulty,
  page = 1,
  limit = 10
}) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      prog_id,
      title,
      description,
      difficulty,
      constraints_text,
      time_limit_ms,
      memory_limit_mb,
      supported_languages,
      public_testcase_count,
      private_testcase_count,
      created_by,
      created_at,
      updated_at
    FROM programs
    WHERE 1=1
  `;

  const values = [];

  if (difficulty) {
    sql += " AND difficulty = ?";
    values.push(difficulty);
  }

  // ✅ Direct inject after converting to Number (safe)
  sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  const [rows] = await pool.execute(sql, values);

  // ❌ NO JSON.parse needed
  return rows;
};

/**
 * 🔍 Get Program By ID
 */
export const getProgramByIdQuery = async (progId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      prog_id,
      title,
      description,
      difficulty,
      constraints_text,
      time_limit_ms,
      memory_limit_mb,
      supported_languages,
      public_testcase_count,
      private_testcase_count,
      created_by,
      created_at,
      updated_at
    FROM programs
    WHERE prog_id = ?
    `,
    [progId]
  );

  // ❌ NO JSON.parse needed
  return rows;
};

/**
 * ✏️ Update Program
 */
export const updateProgramQuery = async (
  progId,
  fields,
  values
) => {
  const sql = `
    UPDATE programs
    SET ${fields}
    WHERE prog_id = ?
  `;

  const updatedValues = values.map((val, index) => {
    // ✅ If updating supported_languages, stringify it
    if (fields.includes("supported_languages") && Array.isArray(val)) {
      return JSON.stringify(val);
    }
    return val;
  });

  await pool.execute(sql, [...updatedValues, progId]);
};

/**
 * ❌ Delete Program
 */
export const deleteProgramQuery = async (progId) => {
  await pool.execute(
    `DELETE FROM programs WHERE prog_id = ?`,
    [progId]
  );
};
export const countProgramsQuery = async (difficulty) => {
  let sql = `SELECT COUNT(*) as total FROM programs WHERE 1=1`;
  const values = [];

  if (difficulty) {
    sql += " AND difficulty = ?";
    values.push(difficulty);
  }

  const [rows] = await pool.execute(sql, values);
  return rows[0].total;
};