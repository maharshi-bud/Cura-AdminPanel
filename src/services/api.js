const BASE = "http://localhost:5001/api/admin";

export const getDoctors = async () => {
  const res = await fetch(`${BASE}/doctors`);
  return res.json();
};

export const deleteDoctor = async (id) => {
  await fetch(`${BASE}/doctors/${id}`, {
    method: "DELETE",
  });
};

export const updateDoctor = async (id, data) => {
  await fetch(`${BASE}/doctors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};