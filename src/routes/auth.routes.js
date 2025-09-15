import express from 'express';
import * as authController from '../controllers/authController.js';
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

router.post('/otp/request', authController.requestOtp);
router.post('/otp/resend/request', authController.requestOtpresend);
router.post('/otp/verify', authController.verifyOtp);
router.post('/logout',authController.Logout)





export default router;
