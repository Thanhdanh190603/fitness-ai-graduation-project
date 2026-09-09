import express from 'express';
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  getExercises,
  updateExercise
} from '../controllers/exerciseController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getExercises);
router.get('/:id', getExerciseById);
router.post('/', protect, adminOnly, createExercise);
router.put('/:id', protect, adminOnly, updateExercise);
router.delete('/:id', protect, adminOnly, deleteExercise);

export default router;
