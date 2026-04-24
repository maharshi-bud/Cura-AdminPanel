import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import adminRoutes from "./routes/adminRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/admin", doctorRoutes);


app.listen(5002, () => {
  console.log("Admin server running on port 5002");
});