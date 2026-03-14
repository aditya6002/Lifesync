import { createSlice } from "@reduxjs/toolkit";

interface Expense {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  
}

interface ExpensesState {
  expenses: Expense[];
    totalSpent: number;
}

const initialState: ExpensesState = {
  expenses: [],
    totalSpent: 0,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
      setTotalSpent: (state, action) => {
    state.totalSpent = action.payload;
  },
  },

});

export const { addExpense, deleteExpense, setTotalSpent } = expensesSlice.actions;

export default expensesSlice.reducer;
