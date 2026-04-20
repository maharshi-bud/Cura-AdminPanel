import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  clinicName: String,
  specialization: String,
  experience: String,
  plan: {
    name: String,
    price: String,
  },
  paymentMethod: String,
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);