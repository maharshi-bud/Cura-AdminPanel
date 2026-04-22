import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

import dotenv from "dotenv";
dotenv.config();

// console.log("ENV TEST:", process.env.JWT_SECRET);

const JWT_SECRET = process.env.JWT_SECRET ; // put in .env in real app
const JWT_EXPIRES = "5m";

// 🔐 REGISTER (run once to create admin)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await AdminUser.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await AdminUser.create({
      name,
      email,
      password: hashed
    });

    res.json({ msg: "Admin created", user: { id: user._id, email } });
  } catch (err) {
    res.status(500).json({ msg: "Register error", err });
  }
};

// 🔐 LOGIN
export const login = async (req, res) => {
// console.log("JWT_SECRET controller:", JWT_SECRET); // DEBUG
  try {
    const { email, password } = req.body;

    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: "Login error", err });
  }
};