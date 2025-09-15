import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protected routes - require authentication
router.use(protect); 

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.post('/profile/avatar', userController.uploadAvatar); // for avatar upload

export default router;