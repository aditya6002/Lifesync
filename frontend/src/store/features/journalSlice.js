import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entries: [],
  loading: true,
  error: null,
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setEntries, setError, setLoading } = journalSlice.actions;

export default journalSlice.reducer;
