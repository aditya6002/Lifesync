import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

import journalReducer from "./features/journalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
  },
});
