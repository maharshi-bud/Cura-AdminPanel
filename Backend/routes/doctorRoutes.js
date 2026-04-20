import express from "express";
import {
  getDoctors,
  deleteDoctor,
  updateDoctor
} from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/doctors", protect, getDoctors);
router.delete("/doctors/:id", protect, deleteDoctor);
router.put("/doctors/:id", protect, updateDoctor);

export default router;