// src/features/auth/auth.api.ts
import { apiClient } from "../../shared/utils/apiClient";

export const authApi = {
  login: (payload) =>
    apiClient.post("/auth/login", payload),

  signup: (payload) =>
    apiClient.post("/auth/signup", payload),

  logout: () =>
    apiClient.post("/auth/logout", {}),

  getMe: () =>
    apiClient.get<AuthResponse["user"]>("/auth/me"),
};
