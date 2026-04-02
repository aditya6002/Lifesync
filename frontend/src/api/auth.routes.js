import apiClient from "../shared/utils/apiClient";

const authApi = {
  login: (payload) => apiClient.post("/auth/login", payload),
  register: (payload) => apiClient.post("/auth/register", payload),
  logout: () => apiClient.post("/auth/logout"),
  getMe: () => apiClient.get("/auth/me"),
  getProfile: () => apiClient.post("/auth/profile"),
  refreshToken: () => apiClient.post("/auth/refresh-token"),
  addProfilePicture: (payload) =>
    apiClient.post("/auth/profile-picture", payload),
  changePassword: (payload) => apiClient.put("/auth/change-password", payload),
  sendEmailVerificationToken: () =>
    apiClient.post("/auth/send-email-verification-token"),
  verifyEmail: (payload) => apiClient.post("/auth/verify-email", payload),
  resetPassword: (payload) => apiClient.post("/auth/reset-password", payload),

  /**
   * @params { resetToken }
   * @body { password, confirmPassword }
   */
  verifyResetPassEmail: (payload) =>
    apiClient.post(`/reset-password/${payload}`),
};

export default authApi;
