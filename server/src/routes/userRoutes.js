import express from 'express';
import { getUsers, updateProfile } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.put('/profile', protect, upload.array('bodyImages', 6), updateProfile);

export default router;
