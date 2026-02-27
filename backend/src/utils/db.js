import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  timezone: "+00:00",
  charset: "utf8mb4",
});

/**
 * ✅ General query function
 * Uses pool.query() instead of execute()
 * Safer for dynamic SQL and transactions
 */
export const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

/**
 * ✅ Get connection for transactions
 */
export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;