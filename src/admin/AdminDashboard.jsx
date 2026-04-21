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
        <div className="table-container">

  <table className="doctor-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Clinic</th>
        <th>Specialization</th>
        <th>Plan</th>
        <th>Payment</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredDoctors.map((doc) => (
        <tr key={doc._id}>
          
          <td className="name-cell">
            {/* <div className="avatar small">
              {doc.fullName?.charAt(0)}
            </div> */}
            {doc.fullName}
          </td>

          <td>{doc.email}</td>
          <td>{doc.clinicName}</td>
          <td>{doc.specialization}</td>

          <td>
            <span className="tag">
              {doc.plan?.name || "No Plan"}
            </span>
          </td>

          <td>
            <span className="tag secondary">
              {doc.paymentMethod || "N/A"}
            </span>
          </td>

          <td>
            <div className="table-actions">
              <button onClick={() => handleEdit(doc)}>Edit</button>
              <button onClick={() => handleDelete(doc._id)}>Delete</button>
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