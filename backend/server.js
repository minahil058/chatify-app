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

// 1. API Routes (Inki priority sab se upar honi chahiye)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 2. Frontend Serving Logic
const frontendDist = path.join(process.cwd(), "frontend", "dist");

// Debugging log jo Vercel dashboard mein nazar aaye ga
console.log("Looking for frontend at:", frontendDist);

if (fs.existsSync(path.join(frontendDist, "index.html"))) {
    // Static files serve karein
    app.use(express.static(frontendDist));

    // Baqi sari requests ko index.html par bhej dein (Frontend Routing)
    app.get("*", (req, res) => {
        // Check taake galti se API calls yahan na phans jayein
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.join(frontendDist, "index.html"));
        }
    });
} else {
    // Agar build fail hui ya folder na mila toh ye error nazar aaye ga
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.status(404).send(`Frontend build not found at: ${frontendDist}. Please check Vercel Build Logs.`);
        }
    });
}

// 3. Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// 4. Start server
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});