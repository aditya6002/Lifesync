import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import expenseReducer from "./features/expensesSlice";
import journalReducer from "./features/journalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses : expenseReducer,
    journal: journalReducer,
  },
});
