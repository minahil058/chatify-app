import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

// ── CORS: allow frontend domain (both local dev and Vercel) ──
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,          // e.g. https://chatify-app.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server calls (no origin) and allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,               // required for cookie-based auth
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ── API Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ── Frontend Serving (production) ──
const frontendDist = path.resolve(__dirname, "../frontend/dist");
console.log("Looking for frontend at:", frontendDist);

if (fs.existsSync(path.join(frontendDist, "index.html"))) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.join(frontendDist, "index.html"));
        }
    });
} else {
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.status(200).json({ message: "Chatify API is running. Frontend not built yet." });
        }
    });
}

// ── Global Error Handler ──
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ── Start ──
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});