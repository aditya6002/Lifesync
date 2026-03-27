import apiClient from "../shared/utils/apiClient";

const journalApi = {
  getAllJournal: () => apiClient("/journal/2026/2"),
};

export default journalApi;
