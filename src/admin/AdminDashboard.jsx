import React, { useEffect, useState } from "react";
import DoctorModal from "../components/DoctorModal";
import {
  getDoctors,
  deleteDoctor,
  updateDoctor
} from "../services/api";
import "./admin.css";

import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [filters, setFilters] = useState({
    plan: "all",
    payment: "all",
    minExp: 0
  });

  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  // 🔄 LOAD DATA
  const loadDoctors = async () => {
    const data = await getDoctors();
    setDoctors(data || []);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // 🗑 DELETE
  const handleDelete = async (id) => {
    await deleteDoctor(id);
    loadDoctors();
  };

  // ✏️ EDIT
  const handleEdit = (doc) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  // 💾 SAVE
  const handleSave = async (updatedDoc) => {
    await updateDoctor(updatedDoc._id, updatedDoc);
    setIsModalOpen(false);
    loadDoctors();
  };

  // 🔍 FILTER LOGIC
  const filteredDoctors = doctors.filter((doc) => {
    return (
      doc.fullName?.toLowerCase().includes(search.toLowerCase()) &&
      (filters.plan === "all" || doc.plan?.name === filters.plan) &&
      (filters.payment === "all" || doc.paymentMethod === filters.payment) &&
      (doc.experience || 0) >= filters.minExp
    );
  });

  // 📊 ANALYTICS DATA
  const planStats = Object.entries(
    doctors.reduce((acc, doc) => {
      const key = doc.plan?.name || "Free";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const paymentStats = Object.entries(
    doctors.reduce((acc, doc) => {
      const key = doc.paymentMethod || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const dailyStats = Object.entries(
    doctors.reduce((acc, doc) => {
      const date = new Date(doc.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>HOMEOSUITE</h2>
        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <h1>{activeTab === "dashboard" ? "Dashboard" : "Analytics"}</h1>

          <div className="header-actions">
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

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            {/* FILTERS */}
            <div className="filters">
              <select onChange={(e) => setFilters(f => ({ ...f, plan: e.target.value }))}>
                <option value="all">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Starter">Starter</option>
              </select>

              <select onChange={(e) => setFilters(f => ({ ...f, payment: e.target.value }))}>
                <option value="all">All Payments</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>

              <div className="slider">
                <label>Experience ≥ {filters.minExp} yrs</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={filters.minExp}
                  onChange={(e) => setFilters(f => ({ ...f, minExp: +e.target.value }))}
                />
              </div>
            </div>

            {/* STATS */}
            <div className="stats">
              <div className="stat">
                <h3>{doctors.length}</h3>
                <p>Total Doctors</p>
              </div>

              <div className="stat">
                <h3>{planStats.find(p => p.name === "Premium")?.value || 0}</h3>
                <p>Premium Users</p>
              </div>

              <div className="stat">
                <h3>{paymentStats.find(p => p.name === "upi")?.value || 0}</h3>
                <p>UPI Payments</p>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-container">
              <table className="doctor-table">
                <thead>
                  <tr>
                    <th>Name</th>
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
                      <td>{doc.fullName}</td>
                      <td>{doc.clinicName}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.experience} yrs</td>
                      <td>{doc.plan?.name}</td>
                      <td>{doc.paymentMethod}</td>
                      <td>
                        <button onClick={() => handleEdit(doc)}>Edit</button>
                        <button onClick={() => handleDelete(doc._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="analytics">

            <div className="chart-card">
              <h3>Users by Plan</h3>
              <BarChart width={400} height={250} data={planStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1f8a78" />
                </BarChart>
              {/* </ResponsiveContainer> */}
            </div>

            <div className="chart-card">
              <h3>Users by Payment</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={paymentStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card full">
              <h3>Registrations Per Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

      </div>

      {/* MODAL */}
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