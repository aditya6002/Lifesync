import apiClient from "../shared/utils/apiClient";

const journalApi = {
  getAllJournal: (month, year) => apiClient.get(`/journal/${year}/${month}`),
  getMonthList: () => apiClient.get("/journal/monthList"),
  addNewJournal: (payload) => apiClient.post("/journal", payload),
  editJournal: (payload) => apiClient.put("/journal", payload),
  deleteJournal: (journalId) => apiClient.delete(`/journal/${journalId}`),
};

export default journalApi;
