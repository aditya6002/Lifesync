import { createSlice } from "@reduxjs/toolkit";

const journalSlice = createSlice({
  name: "journal",
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    updateEntry: (state, action) => {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id,
      );
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload,
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  setLoading,
  setError,
} = journalSlice;

export default journalSlice.reducer;
