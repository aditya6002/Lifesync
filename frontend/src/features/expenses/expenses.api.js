// src/features/expenses/expenses.api.ts
import apiClient from "../../shared/utils/apiClient";

export const expensesApi = {
  getAll: (year, month) => apiClient.get(`/expenses/${year}/${month}`),

  create: (data) => apiClient.post("/expenses", data),

  update: (id, data) => apiClient.put(`/expenses/${id}`, data),

  remove: (id) => apiClient.delete(`/expenses/${id}`),

  
};
