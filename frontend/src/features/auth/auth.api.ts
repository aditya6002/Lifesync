// src/features/auth/auth.api.ts
import type { LoginPayload, SignupPayload, AuthResponse } from "../../shared/types";
import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  withCredentials: true,
});

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  signup: (payload: SignupPayload) =>
    api.post<AuthResponse>("/auth/signup", payload),

  logout: () =>
    api.post<void>("/auth/logout", {}),

  getMe: () =>
    api.get<AuthResponse["user"]>("/auth/me"),
};
