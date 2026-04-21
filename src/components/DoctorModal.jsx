import React, { useEffect, useState } from "react";
import "./modal.css";

function DoctorModal({ isOpen, onClose, doctor, onSave }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    clinicName: "",
    specialization: "",
    experience: ""
  });

  useEffect(() => {
    if (doctor) {
      setForm({
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        clinicName: doctor.clinicName || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience || ""
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...doctor, ...form });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card doctor-modal">

        <h2>Edit Doctor</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* FULL NAME */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                className="modal-input"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Dr. John Doe"
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email</label>
              <input
                className="modal-input"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="doctor@email.com"
              />
            </div>

            {/* CLINIC */}
            <div className="input-group">
              <label>Clinic</label>
              <input
                className="modal-input"
                name="clinicName"
                value={form.clinicName}
                onChange={handleChange}
                placeholder="City Clinic"
              />
            </div>

            {/* SPECIALIZATION */}
            <div className="input-group">
              <label>Specialization</label>
              <input
                className="modal-input"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Cardiologist"
              />
            </div>

            {/* EXPERIENCE */}
            <div className="input-group full">
              <label>Experience (years)</label>
              <input
                className="modal-input"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="5"
              />
            </div>

          </div>

          {/* ACTIONS */}
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