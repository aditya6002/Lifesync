import apiClient from "./apiClient";

export const journalApi = {
  // GET /journal/last — returns last journal entry with meta (date, mood, wordCount, tag)
  getLastJournal: async () => {
    const res = await apiClient.get("/journal/last");
    return res.data;
  },

  // GET /journal?skip=0&limit=15 — paginated list of all journals
  getAllJournals: async (skip = 0, limit = 15) => {
    const res = await apiClient.get("/journal", {
      params: { skip, limit },
    });
    return res.data;
  },

  // GET /journal/:journalId — single journal entry (decrypted)
  getJournal: async (journalId) => {
    const res = await apiClient.get(`/journal/${journalId}`);
    return res.data;
  },

  // POST /journal — create new journal entry { title, content }
  addJournal: async ({ title, content }) => {
    const res = await apiClient.post("/journal", { title, content });
    return res.data;
  },

  // PATCH /journal/:journalId — update journal entry { title, content }
  editJournal: async (journalId, { title, content }) => {
    const res = await apiClient.patch(`/journal/${journalId}`, {
      title,
      content,
    });
    return res.data;
  },

  // DELETE /journal/:journalId — delete a journal entry
  deleteJournal: async (journalId) => {
    const res = await apiClient.delete(`/journal/${journalId}`);
    return res.data;
  },
};

export default journalApi;
