import React, { useState } from "react";
import { loginUser } from "../services/api";
import "./login.css";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);

      if (res.token) {
        localStorage.setItem("token", res.token);
        onLogin();
      } else {
        setError(res.msg || "Invalid credentials");
      }
    } catch {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      {/* 🔷 BACKGROUND DECOR */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>

      {/* 🔷 HEADER */}
      <div className="login-header">
        <div className="logo">H</div>
        <h1>HOMEOSUITE</h1>
        <p>Smart Healthcare Admin Platform</p>
      </div>

      {/* 🔷 CARD */}
      <form className="login-card" onSubmit={handleSubmit}>

        <h2>Welcome back 👋</h2>
        <p className="subtitle">Sign in to your admin account</p>

        {error && <div className="error">{error}</div>}

        {/* EMAIL */}
        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="admin@homeosuite.com"
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="input-group password-group">
          <label>Password</label>
          <input
            name="password"
            type={show ? "text" : "password"}
            placeholder="••••••••"
            onChange={handleChange}
            required
          />
          <span
            className="toggle"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        <button className="login-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </form>

      <p className="login-footer">
        © {new Date().getFullYear()} HomeoSuite
      </p>

    </div>
  );
}

export default Login;