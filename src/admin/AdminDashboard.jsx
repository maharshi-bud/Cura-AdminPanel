import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import DoctorModal from "../components/DoctorModal";
import {
  getDoctors,
  deleteDoctor,
  updateDoctor
} from "../services/api";
import "./admin.css";

import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";








function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔄 Load doctors
  const loadDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const dispatch = useDispatch();

const handleLogout = () => {
  dispatch(logout());
};

  // 🗑 Delete
  const handleDelete = async (id) => {
    await deleteDoctor(id);
    loadDoctors();
  };

  // ✏️ Edit
  const handleEdit = (doc) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  // 💾 Save
  const handleSave = async (updatedDoc) => {
    await updateDoctor(updatedDoc._id, updatedDoc);
    setIsModalOpen(false);
    loadDoctors();
  };

  // 🔍 Filter
  const filteredDoctors = doctors.filter((doc) =>
    doc.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">

      {/* 🔷 SIDEBAR */}
      <aside className="sidebar">
        <h2>HOMEOSUITE</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Doctors</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* 🔷 MAIN */}
      <div className="main">

        {/* 🔷 HEADER */}
        <div className="header">
  <h1>Admin Dashboard</h1>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <input
      type="text"
      placeholder="Search doctor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>

        {/* 🔷 STATS */}
        <div className="stats">
          <div className="stat">
            <h3>{doctors.length}</h3>
            <p>Total Doctors</p>
          </div>

          <div className="stat">
            <h3>
              {doctors.filter(d => d.plan?.name === "Premium").length}
            </h3>
            <p>Premium Users</p>
          </div>

          <div className="stat">
            <h3>
              {doctors.filter(d => d.paymentMethod === "UPI").length}
            </h3>
            <p>UPI Payments</p>
          </div>
        </div>

        {/* 🔷 Table */}
        <div className="table-container">
  <table className="doctor-table">

    <thead>
      <tr>
        <th>Doctor</th>
        <th>Clinic</th>
        <th>Specialization</th>
        <th>Experience</th>
        <th>Plan</th>
        <th>Payment</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredDoctors.map((doc) => (
        <tr key={doc._id}>

          {/* 👤 NAME + EMAIL */}
          <td className="doctor-cell">
            <div className="avatar small">
              {doc.fullName?.charAt(0)}
            </div>

            <div className="doctor-info">
              <strong>{doc.fullName}</strong>
              <span>{doc.email}</span>
            </div>
          </td>

          {/* 🏥 CLINIC */}
          <td>{doc.clinicName || "—"}</td>

          {/* 🩺 SPECIALIZATION */}
          <td>{doc.specialization || "—"}</td>

          {/* 💼 EXPERIENCE */}
          <td>
            <span className="experience-badge">
              {doc.experience ? `${doc.experience} yrs` : "—"}
            </span>
          </td>

          {/* 💎 PLAN */}
          <td>
            <span className={`tag ${doc.plan?.name === "Premium" ? "premium" : ""}`}>
              {doc.plan?.name || "Free"}
            </span>
          </td>

          {/* 💳 PAYMENT */}
          <td>
            <span className="tag secondary">
              {doc.paymentMethod || "N/A"}
            </span>
          </td>

          {/* ⚙️ ACTIONS */}
          <td>
            <div className="table-actions">
              <button className="edit-btn" onClick={() => handleEdit(doc)}>
                ✏️ Edit
              </button>

              <button className="delete-btn" onClick={() => handleDelete(doc._id)}>
                🗑 Delete
              </button>
            </div>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>

      </div>

      {/* 🔷 MODAL */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        onSave={handleSave}
      />
    </div>
  );
}

export default AdminDashboard;