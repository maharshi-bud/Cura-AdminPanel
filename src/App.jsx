import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./admin/Login";

function App() {
  const auth = useSelector((state) => state.auth);

  console.log("AUTH STATE:", auth);

  // ✅ WAIT ONLY until rehydration is COMPLETE
  if (!auth._persist?.rehydrated) {
    return <div>Loading...</div>;
  }

  // ✅ AFTER rehydration → decide UI
  return auth.isAuthenticated && auth.token ? (
    <AdminDashboard />
  ) : (
    <Login />
  );
}

export default App;