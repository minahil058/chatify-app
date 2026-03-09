import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// --- FRONTEND SERVING LOGIC (FIXED) ---

// Vercel par aksar yehi path kaam karta hai
const frontendDist = path.join(process.cwd(), "frontend", "dist");

if (fs.existsSync(path.join(frontendDist, "index.html"))) {
    console.log("Found frontend dist at:", frontendDist);
    app.use(express.static(frontendDist));
    
    app.get("*", (req, res) => {
        // Sirf API routes ko chor kar baqi sab frontend par bhejein
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendDist, "index.html"));
        }
    });
} else {
    // Agar dist folder na mile toh error log karein
    console.error("CRITICAL: frontend/dist/index.html not found!");
    app.get("/", (req, res) => {
        res.send("Backend is running, but Frontend build (dist) is missing. Check your Build Command.");
    });
}

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});