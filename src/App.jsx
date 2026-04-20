import React, { useState } from "react";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./admin/Login";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  return isAuth ? (
    <AdminDashboard />
  ) : (
    <Login onLogin={() => setIsAuth(true)} />
  );
}

export default App;