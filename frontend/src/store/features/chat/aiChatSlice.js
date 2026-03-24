import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [{}],

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
