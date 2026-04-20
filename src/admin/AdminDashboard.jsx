import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import DoctorModal from "../components/DoctorModal";
import {
  getDoctors,
  deleteDoctor,
  updateDoctor
} from "../services/api";
import "./admin.css";

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

          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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

        {/* 🔷 GRID */}
        <div className="grid">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doc={doc}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
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