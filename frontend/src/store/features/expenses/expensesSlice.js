import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  income: 0,
  totalSpend: 0,
  balance: 0,
  category: [],
  monthlySpend: [],
  spendList: [],
  date: new Date(),
  spendMonthHis: [],
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  
});

const {} = expensesSlice.actions;

export default expensesSlice.reducer;
