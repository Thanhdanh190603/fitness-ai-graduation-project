import express from 'express';
import {
  activateMember,
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  verifyResetCode
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/activate-member', protect, activateMember);

export default router;
