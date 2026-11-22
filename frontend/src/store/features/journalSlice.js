import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  journals: [],       // paginated list
  lastJournal: null,  // most recent entry with meta
  currentJournal: null, // single entry being viewed/edited
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  skip: 0,
  hasMore: true,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setJournals: (state, action) => {
      state.journals = action.payload;
    },
    appendJournals: (state, action) => {
      state.journals = [...state.journals, ...action.payload];
    },
    setLastJournal: (state, action) => {
      state.lastJournal = action.payload;
    },
    setCurrentJournal: (state, action) => {
      state.currentJournal = action.payload;
    },
    addJournal: (state, action) => {
      state.journals = [action.payload, ...state.journals];
      state.lastJournal = action.payload;
    },
    updateJournal: (state, action) => {
      const updated = action.payload;
      state.journals = state.journals.map((j) =>
        (j._id || j.id) === (updated._id || updated.id) ? updated : j
      );
      if (state.currentJournal) state.currentJournal = updated;
      if (state.lastJournal && (state.lastJournal._id || state.lastJournal.id) === (updated._id || updated.id)) {
        state.lastJournal = updated;
      }
    },
    removeJournal: (state, action) => {
      const id = action.payload;
      state.journals = state.journals.filter(
        (j) => (j._id || j.id) !== id
      );
      if (state.currentJournal && (state.currentJournal._id || state.currentJournal.id) === id) {
        state.currentJournal = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSaving: (state, action) => {
      state.saving = action.payload;
    },
    setDeleting: (state, action) => {
      state.deleting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSkip: (state, action) => {
      state.skip = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    resetJournals: () => initialState,
  },
});

export const {
  setJournals,
  appendJournals,
  setLastJournal,
  setCurrentJournal,
  addJournal,
  updateJournal,
  removeJournal,
  setLoading,
  setSaving,
  setDeleting,
  setError,
  setSkip,
  setHasMore,
  resetJournals,
} = journalSlice.actions;

export default journalSlice.reducer;
