import Doctor from "../models/Doctor.js";

/* GET ALL */
export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json(doctors);
};

/* UPDATE */
export const updateDoctor = async (req, res) => {
  const updated = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

/* DELETE */
export const deleteDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};