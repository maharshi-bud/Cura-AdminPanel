const BASE = "http://localhost:5001/api";

export const loginUser = async (data) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

// attach token automatically
const getToken = () => localStorage.getItem("token");

export const getDoctors = async () => {
  const res = await fetch(`${BASE}/admin/doctors`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.json();
};

export const deleteDoctor = async (id) => {
  await fetch(`${BASE}/admin/doctors/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};

export const updateDoctor = async (id, data) => {
  await fetch(`${BASE}/admin/doctors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
};