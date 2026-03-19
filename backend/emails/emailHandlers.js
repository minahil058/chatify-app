import { resendClient, sender } from "../lib/resend.js";
import { WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { ENV_VARS } from "../lib/env.js";

export const sendWelcomeEmail = async (email, name) => {
    try {
        // 1. Safety Check for Resend Client
        if (!resendClient) {
            console.error("❌ Resend client not initialized. Check your RESEND_API_KEY.");
            return;
        }

        const clientUrl = ENV_VARS.CLIENT_URL || "http://localhost:5173";
        const currentYear = new Date().getFullYear();

        // 2. Replace placeholders (using Regex /g to replace all occurrences)
        const htmlBody = WELCOME_EMAIL_TEMPLATE
            .replace(/{name}/g, name)
            .replace(/{client_url}/g, clientUrl)
            .replace(/{year}/g, currentYear);

        // 3. Send Email
        const { data, error } = await resendClient.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: 'Welcome to Chatify! 💬',
            html: htmlBody,
        });

        if (error) {
            console.error("Resend Error Detail:", error);
            throw error;
        }

        console.log(`✅ Welcome email sent successfully to: ${email}`);
        return data;

    } catch (error) {
        console.error("❌ Error in sendWelcomeEmail:", error.message);
        // Hum throw isliye kar rahe hain taake controller ko pata chale email fail hui
        throw error;
    }
};