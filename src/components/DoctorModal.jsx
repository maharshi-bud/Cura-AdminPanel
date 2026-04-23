import React, { useEffect, useState } from "react";
import "./modal.css";
import { updateDoctor } from "../services/api"; // ✅ IMPORT

function DoctorModal({ isOpen, onClose, doctor, onSave }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    clinicName: "",
    specialization: "",
    experience: "",
    paymentMethod: "" // ✅ FIXED
  });

  useEffect(() => {
    if (doctor) {
      setForm({
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        clinicName: doctor.clinicName || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        paymentMethod: doctor.paymentMethod || "" // ✅ FIXED
      });
    }
  }, [doctor]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor(doctor._id, form); // ✅ correct data

      onSave();   // refresh table
      onClose();  // close modal
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card doctor-modal">

        <h2>Edit Doctor</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="input-group">
              <label>Full Name</label>
              <input
                className="modal-input"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                className="modal-input"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Clinic</label>
              <input
                className="modal-input"
                name="clinicName"
                value={form.clinicName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Specialization</label>
              <input
                className="modal-input"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Experience</label>
              <input
                className="modal-input"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Payment Method</label>
              <select
  className="modal-input"
  name="paymentMethod"
  value={form.paymentMethod}
  onChange={handleChange}
>
  <option value="">Select Payment</option>
  <option value="upi">UPI</option>
  <option value="card">Card</option>
  {/* <option value="cash">Cash</option> */}
</select>
            </div>

          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default DoctorModal;