import express from "express";
import { getSolvedPrograms } from "../../controllers/user/solvedController.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSolvedPrograms);

export default router;