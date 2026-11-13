import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
