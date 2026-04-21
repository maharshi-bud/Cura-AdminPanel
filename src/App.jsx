import React, { useState } from "react";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./admin/Login";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return isAuth ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={() => setIsAuth(true)} />
  );
}

export default App;