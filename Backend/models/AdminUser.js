import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, default: "admin" }
  },
  { timestamps: true }
);

export default mongoose.model("AdminUser", adminUserSchema);