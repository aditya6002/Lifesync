import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  income: 0,
  totalSpend: 0,
  category: [],
  monthlySpend: [],
  spendList: [],
  date: new Date(),
  spendMonthHis: [],
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpenses: (state, action) => {
      state.spendList.push(action.payload);
    },
    deleteExpense: (state, action) => {
      state.spendList = state.spendList.filter(
        (spend) => spend.id !== action.payload,
      );
    },
    
  },
});

export const { addExpenses } = expensesSlice.actions;

export default expensesSlice.reducer;
