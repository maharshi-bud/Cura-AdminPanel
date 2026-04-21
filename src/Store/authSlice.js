import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  expiresAt: null // ✅ ADD THIS
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {

    // 🔐 LOGIN SUCCESS
loginSuccess: (state, action) => {
  const token = action.payload.token;

  // decode JWT
  const payload = JSON.parse(atob(token.split(".")[1]));

  state.user = action.payload.user;
  state.token = token;
  state.isAuthenticated = true;

  // ✅ real expiry from backend
//   state.expiresAt = payload.exp * 1000;
      state.expiresAt = null;


},

    // 🚪 LOGOUT
    logout: (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.expiresAt = null; // ✅ IMPORTANT
}

  }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;