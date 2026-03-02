// src/middleware/uploadMiddleware.js

import multer from "multer";
import path from "path";
import AppError from "../utils/appError.js";

// ==============================
// 1️⃣ Storage Configuration
// ==============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure uploads folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// ==============================
// 2️⃣ File Filter (CSV + Images)
// ==============================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only CSV and image files are allowed.",
        400
      ),
      false
    );
  }
};

// ==============================
// 3️⃣ Multer Instance
// ==============================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==============================
// 4️⃣ Export Helpers
// ==============================

export const uploadSingle = (fieldName) => upload.single(fieldName);

export const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

export default upload;