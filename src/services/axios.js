import axios from "axios";
import { store } from "../Store/Store";
import { logout } from "../Store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});


// 🔑 ATTACH TOKEN AUTOMATICALLY
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
      config.headers = config.headers || {};

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// 🚨 AUTO LOGOUT ON 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
