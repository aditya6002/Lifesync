import apiClient from "./apiClient";

export const journalApi = {
  getLastJournal: async () => {
    const res = await apiClient.get("/journal/last");
    return res.data;
  },

  getAllJournals: async (skip = 0, limit = 15) => {
    const res = await apiClient.get("/journal", {
      params: { skip, limit },
    });
    return res.data;
  },
};

export default journalApi;
