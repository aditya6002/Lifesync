// src/features/journal/journal.api.ts
import { apiClient } from "../../shared/utils/apiClient";

export const journalApi = {
  getAll: () => apiClient.get("/journal"),
  create: (data) => apiClient.post("/journal", data),
  update: (id, data) => apiClient.put(`/journal/${id}`, data),
  remove: (id) => apiClient.delete(`/journal/${id}`),
};
