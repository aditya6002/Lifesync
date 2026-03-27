import apiClient from "../shared/utils/apiClient";

const authApi = {
  login: (payload) => apiClient.post("/auth/login", payload),
  register: (payload) => apiClient.post("/auth/register", payload),
  logout: () => apiClient.post("/auth/logout"),
  getMe: () => apiClient.get("/auth/me"),
};

export default authApi;
