import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000, //10s
});

export default apiClient;
