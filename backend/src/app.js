import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from '../src/middleware/globalErrorHandler.js';
import AppError from '../src/utils/appError.js';
import authRoutes from '../src/routes/authRoutes.js';
import companyRoutes from '../src/routes/companyRoutes.js';
import programRoutes from '../src/routes/programRoutes.js';
import leaderboardRoutes from "../src/routes/leaderboardRoutes.js";
import profileRoutes from '../src/routes/profileRoutes.js';
import studentFeedbackRoutes from "./routes/studentFeedbackRoutes.js";
import routes from "./routes/index.js";



const app = express();

// Security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { status: 'fail', message: 'Too many requests from this IP. Please try again after 15 minutes.' },
// });
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { status: 'fail', message: 'Too many auth attempts. Please try again after 15 minutes.' },
// });

// app.use('/api', limiter);
// app.use('/api/auth', authLimiter);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());



// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/programs', programRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/student/feedback", studentFeedbackRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", routes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'NEC Placement Treasure API is running.' });
});

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server.`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;