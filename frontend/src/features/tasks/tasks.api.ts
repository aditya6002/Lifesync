// src/features/tasks/tasks.api.ts
import { apiClient } from "../../shared/utils/apiClient";
import type { Task, TaskFormData } from "../../shared/types";

export const tasksApi = {
  getAll:  ()                                       => apiClient.get<Task[]>("/tasks"),
  create:  (data: TaskFormData)                     => apiClient.post<Task>("/tasks", data),
  update:  (id: string, data: Partial<TaskFormData>)=> apiClient.put<Task>(`/tasks/${id}`, data),
  toggle:  (id: string)                             => apiClient.patch<Task>(`/tasks/${id}/toggle`),
  remove:  (id: string)                             => apiClient.delete<void>(`/tasks/${id}`),
};
