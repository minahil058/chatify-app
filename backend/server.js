import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

// ── Guard: crash early with a clear message if critical env vars are missing
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing.join(", "));
    console.error("Please set them in your .env file or Vercel Environment Variables.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true,
}));

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ── Health check (useful for debugging Vercel deployments) ────────────────────
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ── Start (only in non-serverless environments) ───────────────────────────────
// Vercel runs the file directly as a serverless function, no listen() needed
// But for local dev, we start normally
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`✅ Server running on PORT: ${PORT}`);
        connectDB();
    });
} else {
    // In production, connect to DB immediately (serverless warm-up)
    connectDB();
}

export default app;
export { app };