import { BREVO_API_KEY, SENDER_EMAIL, BREVO_API_URL } from '../config/brevo.config.js';

export async function sendTransactionalEmail({ to, subject, htmlContent, params = {}, replyTo = null }) {
    const payload = {
        sender: {
            name: 'Your App',
            email: SENDER_EMAIL,
        },
        to: [
            {
                email: to,
                name: to.split('@')[0],
            },
        ],
        subject,
        htmlContent,
        params,
        ...(replyTo && { replyTo }),
    };

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Brevo error:', data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Fetch error:', error.message);
        return { success: false, error: error.message };
    }
}



