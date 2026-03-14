// src/features/activity/activity.api.ts
import { apiClient } from "../../shared/utils/apiClient";
import type {
  ActivityLog,
  ActivityModule,
  ActivityAction,
  HeatmapCell,
  DailyScore,
} from "../../shared/types";

interface LogPayload {
  module:      ActivityModule;
  action:      ActivityAction;
  entityId?:   string;
  entityName?: string;
  meta?:       Record<string, unknown>;
}

export const activityApi = {
  // Log a single action (called from context/hooks after mutations)
  log: (payload: LogPayload) =>
    apiClient.post<ActivityLog>("/activity", payload),

  // Fetch heatmap data — last N days
  getHeatmap: (days = 70) =>
    apiClient.get<HeatmapCell[]>(`/activity/heatmap?days=${days}`),

  // Fetch recent activity feed
  getRecent: (limit = 10) =>
    apiClient.get<ActivityLog[]>(`/activity/recent?limit=${limit}`),

  // Fetch today's productivity score
  getScore: (date?: string) =>
    apiClient.get<DailyScore>(
      `/activity/score${date ? `?date=${date}` : ""}`
    ),
};
