import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    {
      role: "ai",
      text: "Hello 👋 I'm Lumina AI — your personal productivity assistant. I have full context of your expenses, journal, notes and tasks. What would you like to explore today?",
    },
  ],

  error: null,
  loading: false,
};

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addUserMsg: (state, action) => {
      if (action.payload) {
        return "All field is required";
      }
      state.chats = state.chats.push(action.payload);
    },
  },
});

export const { addUserMsg } = aiSlice;

export default aiSlice.reducer;
