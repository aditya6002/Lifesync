// src/features/notes/notes.api.ts
import { apiClient } from "../../shared/utils/apiClient";

export const notesApi = {
  getAll:  ()                                     => apiClient.get("/notes"),
  create:  (data)                   => apiClient.post("/notes", data),
  update:  (id, data: Partial<NoteFormData>) => apiClient.put(`/notes/${id}`, data),
  remove:  (id)                           => apiClient.delete(`/notes/${id}`),
};
