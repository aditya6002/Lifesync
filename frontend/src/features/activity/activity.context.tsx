// src/features/activity/activity.context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { HeatmapCell, ActivityLog, DailyScore } from "../../shared/types";
import { activityApi } from "./activity.api";

interface ActivityContextType {
  heatmap: HeatmapCell[];
  recentLogs: ActivityLog[];
  dailyScore: DailyScore | null;
  loadingHeatmap: boolean;
  loadingRecent: boolean;
  refreshAll: () => void;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [dailyScore, setDailyScore] = useState<DailyScore | null>(null);
  const [loadingHeatmap, setLoadingHeatmap] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const refreshAll = useCallback(() => {
    setLoadingHeatmap(true);
    setLoadingRecent(true);

    activityApi
      .getHeatmap(70)
      .then((res) => setHeatmap(res.data))
      .catch(console.error)
      .finally(() => setLoadingHeatmap(false));

    activityApi
      .getRecent(10)
      .then((res) => setRecentLogs(res.data))
      .catch(console.error)
      .finally(() => setLoadingRecent(false));

    activityApi
      .getScore()
      .then((res) => setDailyScore(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <ActivityContext.Provider
      value={{
        heatmap,
        recentLogs,
        dailyScore,
        loadingHeatmap,
        loadingRecent,
        refreshAll,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity(): ActivityContextType {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be inside ActivityProvider");
  return ctx;
}
