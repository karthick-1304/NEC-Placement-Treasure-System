import express from 'express';
import { getProgram, getLangTemplate, runProgram, submitProgram } from '../../controllers/user/programController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:progId', getProgram);
router.get('/:progId/template', getLangTemplate);
router.post('/:progId/run', runProgram);
router.post('/:progId/submit', submitProgram);

export default router;