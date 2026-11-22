import apiClient from "./apiClient";

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post("/auth/register", userData);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get("/auth/profile");
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },

  // ── Backend App Lock System ──
  getAppLockStatus: async () => {
    const res = await apiClient.get("/auth/app-lock/status");
    return res.data;
  },

  setAppLock: async ({ passcode, autoLock }) => {
    const res = await apiClient.post("/auth/app-lock/set", { passcode, autoLock });
    return res.data;
  },

  verifyAppLock: async (passcode) => {
    const res = await apiClient.post("/auth/app-lock/verify", { passcode });
    return res.data;
  },

  toggleAppLock: async (isLockEnabled) => {
    const res = await apiClient.post("/auth/app-lock/toggle", { isLockEnabled });
    return res.data;
  },

  updateAppLockSettings: async (autoLock) => {
    const res = await apiClient.post("/auth/app-lock/settings", { autoLock });
    return res.data;
  },

  removeAppLock: async (currentPasscode) => {
    const res = await apiClient.delete("/auth/app-lock", {
      data: { currentPasscode },
    });
    return res.data;
  },

  // Forgot passcode recovery (verified with Account Password on backend)
  forgotAppLock: async ({ accountPassword, newPasscode }) => {
    const res = await apiClient.post("/auth/app-lock/forgot", {
      accountPassword,
      newPasscode,
    });
    return res.data;
  },
};

export default authApi;
