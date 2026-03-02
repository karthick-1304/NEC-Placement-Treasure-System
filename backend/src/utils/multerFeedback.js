// utils/multerFeedback.js

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/feedbacks";

// Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user.user_id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `feedback_${userId}_${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadFeedback = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default uploadFeedback;