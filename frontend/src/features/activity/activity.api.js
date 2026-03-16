// src/features/activity/activity.api.ts
import apiClient from "../../shared/utils/apiClient";

export const activityApi = {
  // Log a single action (called from context/hooks after mutations)
  log: (payload) => apiClient.post("/activity", payload),

  // Fetch heatmap data — last N days
  getHeatmap: (days = 70) => apiClient.get(`/activity/heatmap?days=${days}`),

  // Fetch recent activity feed
  getRecent: (limit = 10) => apiClient.get(`/activity/recent?limit=${limit}`),

  // Fetch today's productivity score
  getScore: (date) =>
    apiClient.get(`/activity/score${date ? `?date=${date}` : ""}`),
};
