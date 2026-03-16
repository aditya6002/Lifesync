import type {
  ActivityLog,
  ActivityModule,
  ActivityAction,
  HeatmapCell,
  DailyScore,
} from "../../shared/types";
import axios from "axios";

interface LogPayload {
  module:      ActivityModule;
  action:      ActivityAction;
  entityId?:   string;
  entityName?: string;
  meta?:       Record<string, unknown>;
}

const api = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL,
  withCredentials:true
})
export const activityApi = {

  log: (payload: LogPayload) =>
    api.post<ActivityLog>("/activity", payload),


  getHeatmap: (days = 70) =>
    api.get<HeatmapCell[]>(`/activity/heatmap?days=${days}`),


  getRecent: (limit = 10) =>
    api.get<ActivityLog[]>(`/activity/recent?limit=${limit}`),


  getScore: (date?: string) =>
    api.get<DailyScore>(
      `/activity/score${date ? `?date=${date}` : ""}`
    ),
};
