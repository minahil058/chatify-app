import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
export const resendClient = apiKey ? new Resend(apiKey) : null;

export const sender = {
    email: process.env.SENDER_EMAIL || "onboarding@resend.dev",
    name: process.env.SENDER_NAME || "Chatify Team",
};