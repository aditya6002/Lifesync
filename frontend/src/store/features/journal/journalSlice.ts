import { createSlice } from "@reduxjs/toolkit";

interface JournalEntry {
  date: string;
  content: string;
}

interface JournalState {
  entries: JournalEntry[];
  totalEntries: number;
  streak: number;
}

const initialState: JournalState = {
    entries: [],
    totalEntries: 0,

    streak: 0,
};

const journalSlice = createSlice({
  name: "journal",
    initialState,
    reducers: {

        addEntry: (state, action) => {            
            state.entries.push(action.payload);
            state.streak += 1;
        },
        deleteJournalEntry: (state, action) => {
            state.entries = state.entries.filter(entry => entry._id !== action.payload);
        },
        editEntry: (state, action) => {
            const { id, content } = action.payload;
            const entry = state.entries.find(entry => entry._id === id);
            if (entry) {
                entry.content = content;
            }
        },
        setStreak: (state, action) => {
            state.streak = action.payload;
        },
    },
});

export const { addEntry, deleteJournalEntry, editEntry, setStreak } = journalSlice.actions;

export default journalSlice.reducer;
