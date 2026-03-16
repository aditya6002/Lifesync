// src/features/tasks/tasks.api.ts
import { apiClient } from "../../shared/utils/apiClient";

export const tasksApi = {
  getAll:  ()                                       => apiClient.get("/tasks"),
  create:  (data)                     => apiClient.post("/tasks", data),
  update:  (id, data: Partial<TaskFormData>)=> apiClient.put(`/tasks/${id}`, data),
  toggle:  (id)                             => apiClient.patch(`/tasks/${id}/toggle`),
  remove:  (id)                             => apiClient.delete(`/tasks/${id}`),
};
