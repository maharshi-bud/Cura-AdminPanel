import Doctor from "../models/Doctor.js";

/* GET ALL DOCTORS */
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching doctors" });
  }
};

/* DELETE DOCTOR */
export const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

/* UPDATE DOCTOR */
export const updateDoctor = async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};