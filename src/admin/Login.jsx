import React, { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await loginUser(form);

    if (res.token) {
      localStorage.setItem("token", res.token);
      onLogin();
    } else {
      alert("Login failed");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", padding: 30, borderRadius: 12 }}>
        <h2>Admin Login</h2>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <br /><br />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <br /><br />

        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}

export default Login;