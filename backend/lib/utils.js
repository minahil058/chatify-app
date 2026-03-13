import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // 1. Environment Variable check (Inside function is safer)
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error("Error: JWT_SECRET is missing in .env file");
        throw new Error("JWT_SECRET is not defined");
    }

    // 2. Token Create karein
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });

    // 3. Cookie mein set karein (Secure Settings)
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,                 // Prevents XSS attacks
        sameSite: "strict",             // Prevents CSRF attacks
        secure: process.env.NODE_ENV !== "development", // Only HTTPS in production
    });

    return token;
};