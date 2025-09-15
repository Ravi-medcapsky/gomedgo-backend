import dotenv from 'dotenv';
dotenv.config();

export const BREVO_API_KEY = process.env.BREVO_API_KEY;
export const SENDER_EMAIL = process.env.SENDER_EMAIL;
export const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

 