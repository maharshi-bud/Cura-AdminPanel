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

  <div className="modal-grid">

    <div className="input-group">
      <label>Full Name</label>
      <input name="fullName" value={form.fullName || ""} onChange={handleChange} />
    </div>

    <div className="input-group">
      <label>Email</label>
      <input name="email" value={form.email || ""} onChange={handleChange} />
    </div>

    <div className="input-group">
      <label>Clinic</label>
      <input name="clinicName" value={form.clinicName || ""} onChange={handleChange} />
    </div>

    <div className="input-group">
      <label>Specialization</label>
      <input name="specialization" value={form.specialization || ""} onChange={handleChange} />
    </div>

    <div className="input-group full">
      <label>Experience</label>
      <input name="experience" value={form.experience || ""} onChange={handleChange} />
    </div>

  </div>

  <div className="modal-actions">
    <button onClick={onClose}>Cancel</button>
    <button className="primary" onClick={handleSubmit}>Save Changes</button>
  </div>
</div>


    </div>
  );
}

export default DoctorModal;