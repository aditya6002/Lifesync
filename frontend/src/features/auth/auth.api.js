// src/features/auth/auth.api.ts
import apiClient from "../../shared/utils/apiClient";

export const authApi = {
  /**
   * @body { email/username, password }
   * @description Login Route
   */
  login: (payload) => apiClient.post("/auth/login", payload),

  /**
   * @body { name, username, interests, email, password }
   * @description New User Register Route
   */
  signup: (payload) => apiClient.post("/auth/register", payload),

  /**
   * @description Logout Route
   */
  logout: () => apiClient.post("/auth/logout", {}),

  /**
   * @description Get user data
   */
  getMe: () => apiClient.get("/auth/me"),

  /**
   * @description Refresh AccessToken Route
   */
  refreshToken: () => apiClient.post("/auth/refresh-token"),

  /**
   * @description Send Email verification Email
   * @access Protected
   */
  sendEmailVerificationToken: () =>
    apiClient.post("/auth/send-email-verification-token"),

  /**
   * @body {otp}
   * @description Verify Email
   */
  verifyEmail: (payload) => apiClient.post("verify-email", payload),

  /**
   * @body {email}
   * @description Send Reset password email
   */
  sendResetPasswordLink: (payload) =>
    apiClient.post("/auth/reset-password", payload),

  /**
   * @body {password, confirmPassword}
   * @description Verify reset password token and change password
   */
  verifyResetPasswordToken: () =>
    apiClient.post("/api/auth/reset-password/:resetToken"),
};
