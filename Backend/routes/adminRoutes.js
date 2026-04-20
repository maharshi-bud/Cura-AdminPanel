import express from "express";
import {
  getDoctors,
  updateDoctor,
  deleteDoctor,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/doctors", getDoctors);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

export default router;