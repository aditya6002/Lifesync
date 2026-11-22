import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  authLoading: true,
  error: null,
  accessToken: null,
  toast: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.authLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  setAccessToken,
  setError,
  setLoading,
  setToast,
  setAuthLoading,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
