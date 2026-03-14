// src/features/expenses/expenses.api.ts
import { apiClient } from "../../shared/utils/apiClient";
import type { Expense, ExpenseFormData } from "../../shared/types";

export const expensesApi = {
  getAll: () =>
    apiClient.get<Expense[]>("/expenses"),

  create: (data: ExpenseFormData) =>
    apiClient.post<Expense>("/expenses", data),

  update: (id: string, data: Partial<ExpenseFormData>) =>
    apiClient.put<Expense>(`/expenses/${id}`, data),

  remove: (id: string) =>
    apiClient.delete<void>(`/expenses/${id}`),
};
