import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Store/authSlice";

import { loginUser } from "../services/api";
import docpic from "../img/Doc.png";
import bg from "../img/BG.jpg";
import "./login.css";

function Login() {
  const dispatch = useDispatch();

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
        // 🔥 REDUX LOGIN
        dispatch(loginSuccess(res));
      } else {
        setError(res.msg || "Invalid credentials");
      }
    } 
    
    catch (err) {
  console.error(err); // optional debug

  setError(
    err?.response?.data?.msg ||   // backend message
    err?.message ||               // JS error
    "Server error"                // fallback
  );
} 

    setLoading(false);
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay"></div>

      <div className="login-card">

        {/* LEFT → IMAGE */}
        <div className="card-left">
          <img src={docpic} alt="Doctor" />
        </div>

        {/* RIGHT → FORM */}
        <div className="card-right">

          <div className="brand">
            <div className="logo">H</div>
            <h1>HOMEOSUITE</h1>
            <p>Smart Healthcare Admin Platform</p>
          </div>

          <form onSubmit={handleSubmit}>

            <h2>Welcome back 👋</h2>
            <p className="subtitle">Sign in to continue</p>

            {error && <div className="error">{error}</div>}

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

            <div className="input-group password-group">
              <label>Password</label>
              <input
                name="password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
              <span onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </span>
            </div>

            <button className="loginbtn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;