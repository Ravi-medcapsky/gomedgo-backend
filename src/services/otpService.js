import { otpVerificationModel } from '../models/otpVerification.model.js';
import { generateOtp, getExpiryTime } from '../utils/otpUtils.js';
import { sendTransactionalEmail } from '../helpers/brevo.helper.js';

// Email validation function
const isValidEmail = (email) => {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
return email.length <= 320 && emailRegex.test(email);
};

export const sendOtp = async (identifier, type) => {
  const otp = generateOtp();
  const expiresAt = getExpiryTime(5);

  await otpVerificationModel.create({ identifier, otp, expiresAt, type });

  // Only send email if identifier is a valid email
  if (type === 'email' && isValidEmail(identifier)) {
    const subject = `Welcome to Our App!`;
    const htmlContent = `<h1>Hello User</h1><p>Thanks for joining us!<br>Your OTP is ${otp}</p>`;
    const params = { identifier,otp };

    try {
      const emailResult = await sendTransactionalEmail({
        to: identifier,
        subject,
        htmlContent,
        params,
      });
      
      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error);
        throw new Error('Failed to send OTP email');
      }
      
      return emailResult;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send OTP email');
    }
  } else if (type === 'mobile') {
    // For SMS, you would implement SMS sending logic here
    // For now, just return success (you can integrate SMS service later)
    console.log(`SMS OTP ${otp} would be sent to ${identifier}`);
    return { success: true, message: 'OTP sent via Mobile',otp };
  } else {
    // Invalid email format or unsupported type
    throw new Error('Invalid identifier format or unsupported OTP type');
  }
};

export const verifyOtp = async (identifier_session, otp) => {
    const record = await otpVerificationModel.verifyOtp(identifier_session, otp);
    if (!record) return false;

    await otpVerificationModel.markVerified(record.id);
    return true;
};



