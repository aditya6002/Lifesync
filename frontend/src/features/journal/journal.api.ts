// src/features/journal/journal.api.ts
import { apiClient } from "../../shared/utils/apiClient";
import type { JournalEntry, JournalFormData } from "../../shared/types";

export const journalApi = {
  getAll:  ()                              => apiClient.get<JournalEntry[]>("/journal"),
  create:  (data: JournalFormData)         => apiClient.post<JournalEntry>("/journal", data),
  update:  (id: string, data: Partial<JournalFormData>) => apiClient.put<JournalEntry>(`/journal/${id}`, data),
  remove:  (id: string)                   => apiClient.delete<void>(`/journal/${id}`),
};
