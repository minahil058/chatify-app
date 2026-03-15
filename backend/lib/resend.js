import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

export const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sender = {
    email: process.env.SENDER_EMAIL || "onboarding@resend.dev",
    name: process.env.SENDER_NAME || "Chatify Team",
};