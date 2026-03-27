import apiClient from "../shared/utils/apiClient";

const journalApi = {
  getAllJournal: (month, year) => apiClient.get(`/journal/${year}/${month}`),
  addNewJournal: (payload) => apiClient.post("/journal", payload),
  editJournal: (payload) => apiClient.put("/journal", payload),
  deleteJournal: (journalId) => apiClient.delete(`/journal/${journalId}`),
};

export default journalApi;
