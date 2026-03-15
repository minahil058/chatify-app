import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
    PORT: process.env.PORT || 5001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SENDER_EMAIL: process.env.SENDER_EMAIL || "onboarding@resend.dev",
    SENDER_NAME: process.env.SENDER_NAME || "Chatify Team",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
