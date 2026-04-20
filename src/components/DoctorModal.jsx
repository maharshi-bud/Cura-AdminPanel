import React, { useState, useEffect } from "react";

function DoctorModal({ isOpen, onClose, doctor, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (doctor) setForm(doctor);
  }, [doctor]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Edit Doctor</h2>

        <input
          name="fullName"
          value={form.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          name="clinicName"
          value={form.clinicName || ""}
          onChange={handleChange}
          placeholder="Clinic"
        />

        <input
          name="specialization"
          value={form.specialization || ""}
          onChange={handleChange}
          placeholder="Specialization"
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleSubmit}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default DoctorModal;