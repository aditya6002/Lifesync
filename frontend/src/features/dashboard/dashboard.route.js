import apiClient from "../../shared/utils/apiClient";

const dashboardApi = {
  getAllData: async () => await apiClient.get("/home"),
};

export default dashboardApi;
