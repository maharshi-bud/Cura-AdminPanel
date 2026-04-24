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
  PlanChart,
  PaymentChart,
  DailyChart,
   DoughnutChart,
   StackedBarChart
} from "../components/AnalyticsCharts";



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  Filler
} from "chart.js";

// 🔥 REGISTER EVERYTHING (CRITICAL)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  Filler
);

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  const [filters, setFilters] = useState({
    plan: "all",
    payment: "all",
    minExp: 0
  });

const [selectedFilter, setSelectedFilter] = useState("all");
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  // 🔄 LOAD DATA
  const loadDoctors = async () => {
    try {
      const res = await getDoctors();
      const data = Array.isArray(res) ? res : res.data;
      setDoctors(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // 🔍 FILTER
  const filteredDoctors = doctors.filter((doc) => {
    return (
      doc.fullName?.toLowerCase().includes(search.toLowerCase()) &&
      (filters.plan === "all" || doc.plan?.name === filters.plan) &&
      (filters.payment === "all" || doc.paymentMethod === filters.payment) &&
      (doc.experience || 0) >= filters.minExp
    );
  });

  // 🔀 SORT (AFTER FILTER)
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "plan") {
      aVal = a.plan?.name || "";
      bVal = b.plan?.name || "";
    }

    if (sortConfig.key === "experience") {
      return sortConfig.direction === "asc"
        ? a.experience - b.experience
        : b.experience - a.experience;
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;

    return 0;
  });
  // Filter 
  const options = [
  { label: "All Filters", value: "all" },
  { label: "Enterprise Plan", value: "enterprise" },
  { label: "Starter Plan", value: "starter" },
  { label: "UPI", value: "upi" },
  { label: "Card", value: "card" },
  { label: "Experience ≥ 5 yrs", value: "exp5" },
  { label: "Experience ≥ 10 yrs", value: "exp10" }
];

function FilterDropdown({ onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onChange(option.value);
  };
}



  // 📊 STATS
const  planStats = Object.entries(
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


  const specializationStats = Object.entries(
  doctors.reduce((acc, doc) => {
    const key = doc.specialization || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

// 
  // console.log ("plan" + planStats );
  // const totRevenue =( planStats[0]["value"] * 20 + planStats[1]["value"] * 50 +planStats[2]["value"] * 39 ) || 0;
//  const totRevenue = 0;

const PLAN_PRICES = {
  Starter: 499,
  Enterprise: 1999,
  Professional: 999
};

const totRevenue = planStats.reduce((total, item) => {
  const price = PLAN_PRICES[item.name] || 0;
  return total + item.value * price;
}, 0);





  // console.log (doc.createdAt);

  const PLAN_DURATION = {
  starter: 3,
  professional: 6,
  enterprise: 12
};

const expiredUsers = doctors.filter((doc) => {
  if (!doc.createdAt || !doc.plan?.name) return false;

  const planName = doc.plan.name.toLowerCase().trim();
  const duration = PLAN_DURATION[planName];

  if (!duration) return false;

  const createdDate = new Date(doc.createdAt);

  const expiryDate = new Date(createdDate);
  expiryDate.setMonth(expiryDate.getMonth() + duration);

  // console.log (doc.fullName );
  // console.log (expiryDate );

  return new Date() > expiryDate;
}).length;




//Last week

const lastWeekRegistrations = doctors.filter((doc) => {
  if (!doc.createdAt) return false;

  const createdDate = new Date(doc.createdAt);
  if (isNaN(createdDate)) return false;

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return createdDate >= sevenDaysAgo && createdDate <= now;
}).length;





const revenueStats = Object.entries(
  doctors.reduce((acc, doc) => {
    if (!doc.createdAt || !doc.plan?.name) return acc;

    const date = new Date(doc.createdAt);
    const key = date.toISOString().slice(0, 7); // YYYY-MM

    const price = PLAN_PRICES[doc.plan.name] || 0;

    acc[key] = (acc[key] || 0) + price;

    return acc;
  }, {})
)
.sort((a, b) => new Date(a[0]) - new Date(b[0]))
.map(([key, value]) => {
  const date = new Date(key);
  const label = date.toLocaleString("default", {
    month: "short",
    year: "2-digit"
  });
  return { name: label, value };
});


const activePlanStats = Object.entries(
  doctors.reduce((acc, doc) => {
    if (!doc.plan?.name || !doc.createdAt) return acc;

    const PLAN_DURATION = {
      Starter: 3,
      Professional: 6,
      Enterprise: 12
    };

    const created = new Date(doc.createdAt);
    const expiry = new Date(created);
    expiry.setMonth(expiry.getMonth() + PLAN_DURATION[doc.plan.name]);

    if (new Date() > expiry) return acc; // skip expired

    const key = doc.plan.name;
    acc[key] = (acc[key] || 0) + 1;

    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));






const addMonthsSafe = (date, months) => {
  const d = new Date(date);
  const day = d.getDate();

  d.setDate(1); // prevent overflow
  d.setMonth(d.getMonth() + months);

  // restore day safely
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));

  return d;
};


const expiringMatrix = doctors.reduce((acc, doc) => {
  if (!doc.plan?.name || !doc.createdAt) return acc;

  const PLAN_DURATION = {
    Starter: 3,
    Professional: 6,
    Enterprise: 12
  };

  const duration = PLAN_DURATION[doc.plan.name];
  if (!duration) return acc;

  const now = new Date();
  const created = new Date(doc.createdAt);
  const expiry = addMonthsSafe(created, duration);

  const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);

  let bucket = null;

  if (diffDays >= 0 && diffDays <= 7) bucket = "0-7";
  else if (diffDays <= 14) bucket = "8-14";
  else if (diffDays <= 30) bucket = "15-30";

  if (!bucket) return acc;

  if (!acc[bucket]) acc[bucket] = { Starter: 0, Professional: 0, Enterprise: 0 };

  acc[bucket][doc.plan.name]++;

  return acc;
}, {});

const expiringStats = Object.entries(expiringMatrix).map(([name, plans]) => ({
  name,
  value: Object.values(plans).reduce((total, count) => total + count, 0)
}));


const expiringChartData = {
  labels: Object.keys(expiringMatrix),
  datasets: [
    {
      label: "Starter",
      data: Object.keys(expiringMatrix).map(
        k => expiringMatrix[k]?.Starter || 0
      ),
      backgroundColor: "#4f46e5"
    },
    {
      label: "Professional",
      data: Object.keys(expiringMatrix).map(
        k => expiringMatrix[k]?.Professional || 0
      ),
      backgroundColor: "#f59e0b"
    },
    {
      label: "Enterprise",
      data: Object.keys(expiringMatrix).map(
        k => expiringMatrix[k]?.Enterprise || 0
      ),
      backgroundColor: "#1f8a78",
                borderRadius: 8

    }
  ]
};



const monthlyRevenue = doctors.reduce((total, doc) => {
  if (!doc.plan?.name || !doc.createdAt) return total;

  const PLAN_PRICE = {
    Starter: 499,
    Professional: 999,
    Enterprise: 1999
  };

  const created = new Date(doc.createdAt);
  const now = new Date();

  const isSameMonth =
    created.getMonth() === now.getMonth() &&
    created.getFullYear() === now.getFullYear();

  if (isSameMonth) {
    return total + (PLAN_PRICE[doc.plan.name] || 0);
  }

  return total;
}, 0);



const fixedDailyStats = [...dailyStats].reverse();

const getStatus = (doc) => {
  if (!doc.createdAt || !doc.plan?.name) return "Unknown";

  const PLAN_DURATION = {
    Starter: 3,
    Professional: 6,
    Enterprise: 12
  };

  const duration = PLAN_DURATION[doc.plan.name];
  if (!duration) return "Unknown";

  const created = new Date(doc.createdAt);
  const expiry = addMonthsSafe(created, duration);

  return new Date() > expiry ? "Expired" : "Active";
};






  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <p>H</p>
        <h2>HOMEOSUITE</h2>
        <ul>
          <li onClick={() => setActiveTab("Dashboard")}>Dashboard</li>
          <li onClick={() => setActiveTab("Inquiries")}>Inquiries</li>
        </ul>
      </aside>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <h1>{activeTab}</h1>

          <div className="header-actions">



          
          
<button className="Btn3" onClick={handleLogout}>
  
  <div className="sign3"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
  
  <div className="text3">Logout</div>
</button>


          
          
          
          
          
          
          
          </div>
        </div>

        {/* DASHBOARD */}
        {activeTab === "Dashboard" && (
          <>
         

   
  {/* KPI ROW */}
  <div className="kpi-row">
    <div className="kpi-card">
      <h4>Total Users</h4>
      <h2>{doctors.length}</h2>
    </div>

    <div className="kpi-card">
      <h4>Revenue</h4>
      <h2>₹{totRevenue}</h2>
    </div>

    <div className="kpi-card">
      <h4>New Users</h4>
      <h2>{lastWeekRegistrations}</h2>
    </div>

    <div className="kpi-card">
      <h4>Expired</h4>
      <h2>{expiredUsers}</h2>
    </div>
    
    <div className="kpi-card">
  <h4>This Month</h4>
  <h2>₹{monthlyRevenue}</h2>
</div>
  </div>

  {/* MAIN GRID */}
  <div className="dashboard-grid">
{/* ROW 1 */}
<div className="dashboard-top">
  <div className="dashcard large">
    <h3>Registrations Trend</h3>
    <DailyChart data={fixedDailyStats} />
  </div>

  <div className="dashcard">
    <h3>Users by Plan</h3>
    <DoughnutChart data={planStats} />
  </div>
</div>

{/* ROW 2 */}
<div className="dashboard-bottom">
  <div className="dashcard">
          <h2>Revenue /month</h2>
    <PlanChart data={revenueStats} label="Revenue ₹" />
  </div>

  <div className="dashcard">
    <h3>Expiring Soon</h3>
    <StackedBarChart  data={expiringChartData} />
  </div>

  <div className="dashcard">
    <h3>Specializations</h3>
    <PlanChart data={specializationStats} />
  </div>
</div>
  
  </div>

              {/* Tables / Graphs  */}




{/* </div> */} 



         
         
          </>
        )}

        {/* Inquiries */}
      {activeTab === "Inquiries" && (
  <div className="Inquiries">

    
 
                {/* 🔥 TOP BAR */}
<div className="top-controls">



  {/* LEFT → FILTER */}
  {/* <div className="filter-dropdown"> */}







 
   <div className="filter-dropdown">
  <select
    className="filter-select"
    value={selectedFilter}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedFilter(value);

      // 🔥 APPLY FILTER LOGIC
      if (value === "all") {
        setFilters({ plan: "all", payment: "all", minExp: 0 });
      }

      if (value === "enterprise") {
        setFilters((f) => ({ ...f, plan: "Enterprise" }));
      }

      if (value === "starter") {
        setFilters((f) => ({ ...f, plan: "Starter" }));
      }

      if (value === "upi") {
        setFilters((f) => ({ ...f, payment: "upi" }));
      }

      if (value === "card") {
        setFilters((f) => ({ ...f, payment: "card" }));
      }

      if (value === "exp5") {
        setFilters((f) => ({ ...f, minExp: 5 }));
      }

      if (value === "exp10") {
        setFilters((f) => ({ ...f, minExp: 10 }));
      }
    }}
  >
    <option value="all">All Filters</option>
    <option value="enterprise">Enterprise Plan</option>
    <option value="starter">Starter Plan</option>
    <option value="upi">UPI</option>
    <option value="card">Card</option>
    <option value="exp5">Experience ≥ 5 yrs</option>
    <option value="exp10">Experience ≥ 10 yrs</option>
  </select>
</div>











   {/* </div> */}

  {/* RIGHT → SEARCH */}
           
             <input
              placeholder="Search..."
              value={search}
              className="input"
              onChange={(e) => setSearch(e.target.value)}
            />

</div>

            {/* TABLE */}
            <div className="table-container">
              <table className="doctor-table">

                <thead>
                  <tr>
                    <th onClick={() =>
                      setSortConfig({
                        key: "fullName",
                        direction: sortConfig.direction === "asc" ? "desc" : "asc"
                      })
                    }>
                      Name ⬍
                    </th>

                    <th>Clinic</th>
                    <th>Specialization</th>

                    <th onClick={() =>
                      setSortConfig({
                        key: "experience",
                        direction: sortConfig.direction === "asc" ? "desc" : "asc"
                      })
                    }>
                      Experience ⬍
                    </th>

                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedDoctors.map((doc) => (
                    <tr key={doc._id}>
                      <td>{doc.fullName}</td>
                      <td>{doc.clinicName}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.experience} yrs</td>
                      <td>{doc.plan?.name}</td>

                      <td>{doc.paymentMethod[0].toUpperCase()+ doc.paymentMethod.slice(1)}  </td>
                      <td>
  <span className={`status ${getStatus(doc).toLowerCase()}`}>
    {getStatus(doc)}
  </span>
</td>

                      <td>



<button className="editBtn" onClick={() => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  }}>
      <svg height="1em" viewBox="0 0 512 512">
    <path
      d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
    ></path>
  </svg>

  </button>


<button className="bin-button" onClick={async () => {
    const confirmDelete = window.confirm("Delete this doctor?");
    if (!confirmDelete) return;

    await deleteDoctor(doc._id);
    loadDoctors(); // 🔥 refresh table
  }}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 39 7"
    class="bin-top"
  >
    <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
    <line
      strokeWidth="3"
      stroke="white"
      y2="1.5"
      x2="26.0357"
      y1="1.5"
      x1="12"
    ></line>
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 33 39"
    class="bin-bottom"
  >
    <mask fill="white" id="path-1-inside-1_8_19">
      <path
        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
      ></path>
    </mask>
    <path
      mask="url(#path-1-inside-1_8_19)"
      fill="white"
      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
    ></path>
    <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
    <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 89 80"
    class="garbage"
  >
    <path
      fill="white"
      d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
    ></path>
  </svg>
</button>



    
    
    
    
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

  </div>
)}

      </div>

      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        onSave={() => loadDoctors()}
      />
    </div>
  );
}

export default AdminDashboard;
