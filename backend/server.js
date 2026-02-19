import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import pool from './src/utils/db.js';
app._router.stack.forEach((r) => {
  if (r.route) console.log(r.route.path);
  if (r.handle?.stack) {
    r.handle.stack.forEach((rr) => {
      if (rr.route) console.log(rr.route.path);
    });
  }
});
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log('✅ Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.name, err.message);
  process.exit(1);
});

startServer();