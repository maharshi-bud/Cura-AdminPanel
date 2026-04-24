import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
// import adminRoutes from "./routes/adminRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../dist");
const clientIndexPath = path.join(clientDistPath, "index.html");
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

// app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/admin", doctorRoutes);
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(clientIndexPath);
  });
} else {
  app.get("/", (_req, res) => {
    res.json({ ok: true, service: "backend" });
  });
}

app.listen(port, () => {
  console.log(`Admin server running on port ${port}`);
});
