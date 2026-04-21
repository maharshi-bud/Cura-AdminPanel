import api from "./axios";

// 🔐 LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 📥 GET DOCTORS
export const getDoctors = async () => {
  const res = await api.get("/admin/doctors");
  return res.data;
};

// 🗑 DELETE
export const deleteDoctor = async (id) => {
  await api.delete(`/admin/doctors/${id}`);
};

// ✏️ UPDATE
export const updateDoctor = async (id, data) => {
  await api.put(`/admin/doctors/${id}`, data);
};