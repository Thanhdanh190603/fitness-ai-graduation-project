import express from 'express';
import { freeAnalysis, mealAnalysis, mealTextAnalysis, mealPlanAnalysis, sleepAnalysis, chatWithAi } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/free-analysis', protect, freeAnalysis);
router.post('/meal-analysis', protect, upload.single('mealImage'), mealAnalysis);
router.post('/meal-text-analysis', protect, mealTextAnalysis);
router.post('/meal-plan-analysis', protect, mealPlanAnalysis);
router.post('/sleep-analysis', protect, sleepAnalysis);
router.post('/chat', protect, chatWithAi);

export default router;
