// src/features/notes/notes.api.ts
import { apiClient } from "../../shared/utils/apiClient";
import type { Note, NoteFormData } from "../../shared/types";

export const notesApi = {
  getAll:  ()                                     => apiClient.get<Note[]>("/notes"),
  create:  (data: NoteFormData)                   => apiClient.post<Note>("/notes", data),
  update:  (id: string, data: Partial<NoteFormData>) => apiClient.put<Note>(`/notes/${id}`, data),
  remove:  (id: string)                           => apiClient.delete<void>(`/notes/${id}`),
};
