import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();

// ESM-safe __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

// (Optional) debug logging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve Vite frontend build in production
if (process.env.NODE_ENV === "production") {
  // __dirname is .../backend, so this resolves to .../frontend/dist
  const frontendDist = path.join(__dirname, "..", "frontend", "dist");

  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});