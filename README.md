
---

# 🏥 HOMEOSUITE Admin Dashboard

A modern healthcare admin dashboard built to manage doctors, track revenue, and visualize analytics with interactive charts.

---

## 🚀 Features

### 📊 Dashboard

* Total Users, Revenue, New Users, Expired Users
* Monthly Revenue tracking
* Registration trends (line chart)
* Plan distribution (doughnut chart)
* Revenue trends (bar chart)
* Expiring users (stacked chart with plan breakdown)
* Specialization insights

---

### 📋 Inquiries (Doctor Management)

* View all registered doctors
* Search by name
* Filter by:

  * Plan (Starter, Enterprise)
  * Payment method (UPI, Card)
  * Experience (≥5, ≥10 years)
* Sort by:

  * Name
  * Experience
* Edit doctor details
* Delete doctor

---

### 📈 Analytics & Insights

* Plan distribution stats
* Payment method usage
* Daily registration trends
* Active vs expired users
* Expiring users (0–7, 8–14, 15–30 days buckets)

---

## 🧠 Key Concepts Implemented

* React functional components + hooks
* State management using Redux
* Data aggregation using `reduce()`
* Chart.js integration via `react-chartjs-2`
* Dynamic filtering + sorting
* Safe date handling (expiry calculations)
* Modular chart components

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **State Management:** Redux Toolkit
* **Charts:** Chart.js + react-chartjs-2
* **Styling:** Custom CSS
* **Backend (assumed):** Node.js / Express
* **Database (assumed):** MongoDB

---

## 📁 Project Structure

```bash
src/
│
├── components/
│   ├── AnalyticsCharts.jsx
│   ├── DoctorModal.jsx
│
├── pages/
│   ├── AdminDashboard.jsx
│
├── services/
│   ├── api.js
│
├── store/
│   ├── authSlice.js
│
├── styles/
│   ├── admin.css
```

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/your-username/homeosuite-admin.git

# Navigate
cd homeosuite-admin

# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## Railway Deployment

This repo is set up for a single Railway service:

- the frontend is built with Vite
- the backend serves the built `dist/` folder
- API requests use the same origin via `/api`

### Build / Start

- Build command: `npm run build`
- Start command: `npm start`

### Required Railway Variables

```bash
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

### Optional Variables

```bash
PORT=5002
FRONTEND_URL=https://your-app.up.railway.app
VITE_API_URL=/api
```

### Local Development

- frontend runs on Vite
- `/api` is proxied to `http://localhost:5002`
- backend still runs from `Backend/server.js`

---

## 📊 Charts Included

* 📈 Line Chart → Registrations trend
* 🍩 Doughnut Chart → Users by plan
* 📊 Bar Chart → Revenue / Specializations
* 📚 Stacked Bar → Expiring users per plan

---

## 🧩 Business Logic Highlights

### 💰 Revenue Calculation

* Based on plan pricing (Starter, Professional, Enterprise)

### ⏳ Expiry System

* Plans:

  * Starter → 3 months
  * Professional → 6 months
  * Enterprise → 12 months
* Buckets:

  * 0–7 days
  * 8–14 days
  * 15–30 days

### 📅 Safe Date Handling

* Custom `addMonthsSafe()` prevents JS date overflow bugs

---

## 🎯 Future Improvements

* 🔔 Expiry alerts system
* 📧 Email notifications for renewals
* 📊 Advanced analytics (growth %, forecasting)
* 🔍 Drill-down charts (click → filter table)
* 📱 Responsive mobile UI
* 🔐 Role-based admin access

---

## 🧑‍💻 Author

**Maharshi Patel**
B.Tech CSE | VIT Bhopal

---

## 📌 Notes

* This project focuses on **real-world dashboard design**
* Built with scalable structure for future features
* Designed to mimic **production SaaS admin panels**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and feel free to contribute!

---


