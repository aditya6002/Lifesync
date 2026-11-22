import apiClient from "./apiClient";

const expenseApi = {
  // Get all expenses with optional filters
  getExpenses: async (params = {}) => {
    const res = await apiClient.get("/expense", { params });
    return res.data;
  },

  // Get financial summary & trends
  getSummary: async (year) => {
    const res = await apiClient.get("/expense/summary", { params: { year } });
    return res.data;
  },

  // Get single expense
  getExpense: async (id) => {
    const res = await apiClient.get(`/expense/${id}`);
    return res.data;
  },

  // Add expense / income
  addExpense: async (data) => {
    const res = await apiClient.post("/expense", data);
    return res.data;
  },

  // Update expense
  updateExpense: async (id, data) => {
    const res = await apiClient.put(`/expense/${id}`, data);
    return res.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const res = await apiClient.delete(`/expense/${id}`);
    return res.data;
  },
};

export default expenseApi;
