import express from 'express';
import { createPost, getAdminPosts, getApprovedPosts, getMyPosts, reviewPost } from '../controllers/blogController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getApprovedPosts);
router.post('/', protect, createPost);
router.get('/mine', protect, getMyPosts);
router.get('/admin', protect, adminOnly, getAdminPosts);
router.patch('/:id/review', protect, adminOnly, reviewPost);

export default router;