import express from 'express';
import { deleteUser, getUsers, resetMemberPassword, updateAvatar, updateProfile } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.post('/:userId/reset-password', protect, adminOnly, resetMemberPassword);
router.delete('/:userId', protect, adminOnly, deleteUser);
router.put('/profile', protect, upload.array('bodyImages', 6), updateProfile);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

export default router;
