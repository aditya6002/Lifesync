import {} from '@reduxjs/toolkit';
import { createSlice } from "@reduxjs/toolkit";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesState {
  notes: Note[];
  totalNotes: number;
}

const initialState: NotesState = {
  notes: [],
    totalNotes: 0,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    editNote: (state, action) => {
      const { id, title, content } = action.payload;
      const note = state.notes.find(note => note.id === id);
      if (note) {
        note.title = title;
        note.content = content;
      }
    },
    setTotalNotes: (state, action) => {
        state.totalNotes = action.payload;
    },
  },
});

export const { addNote, deleteNote, editNote , setTotalNotes} = notesSlice.actions;

export default notesSlice.reducer;