import apiClient from "../../shared/utils/apiClient";

const dashboardApi = {
  getAllData: () => apiClient.get("/home"),
};

export default dashboardApi;
