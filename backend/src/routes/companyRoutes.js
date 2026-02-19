import express from 'express';
import {
  getAllCompanies,
  getCompany,
  getDriveFeedbacks,
  getDrivePrograms,
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', protect,getAllCompanies);
router.get('/:id', protect,getCompany);
router.get('/:id/drives/:driveId/feedbacks', protect,getDriveFeedbacks);
router.get('/:id/drives/:driveId/programs', protect,getDrivePrograms);

export default router;