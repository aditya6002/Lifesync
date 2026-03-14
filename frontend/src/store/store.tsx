import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice";
import journalReducer from "./features/journal/journalSlice";
import notesReducer from "./features/notes/notesSlice";
import tasksReducer from "./features/tasks/tasksSlice";
import expensesReducer from "./features/expenses/expensesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    journal: journalReducer,
    notes: notesReducer,
    tasks: tasksReducer,
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
