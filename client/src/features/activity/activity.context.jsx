// src/features/activity/activity.context.jsx
import { createContext, useContext } from "react";

const HEATMAP = Array.from({ length: 70 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (69 - i));
  const count = Math.random() > 0.38 ? Math.floor(Math.random() * 6) + 1 : 0;
  const mods = ["expenses", "journal", "notes", "tasks"];
  return {
    date: d.toISOString().slice(0, 10),
    count,
    level: count === 0 ? 0 : count < 2 ? 1 : count < 5 ? 2 : count < 9 ? 3 : 4,
    label:
      count === 0
        ? "No activity"
        : `${count} action${count > 1 ? "s" : ""} — ${mods[Math.floor(Math.random() * mods.length)]}`,
    modules: count > 0 ? [mods[Math.floor(Math.random() * mods.length)]] : [],
  };
});

const LOGS = [
  {
    id: "a1",
    userId: "u1",
    module: "expenses",
    action: "created",
    entityName: "Zomato Order",
    date: "2026-03-11",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "a2",
    userId: "u1",
    module: "journal",
    action: "created",
    entityName: "Productive Wednesday",
    date: "2026-03-11",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "a3",
    userId: "u1",
    module: "tasks",
    action: "completed",
    entityName: "Read DBMS Chapter 7",
    date: "2026-03-11",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "a4",
    userId: "u1",
    module: "notes",
    action: "updated",
    entityName: "Project Ideas 2025",
    date: "2026-03-11",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

const SCORE = {
  date: "2026-03-11",
  score: 82,
  totalActions: 6,
  breakdown: {
    tasks: { score: 50, weight: "40%" },
    journal: { score: 100, weight: "25%" },
    expenses: { score: 100, weight: "20%" },
    notes: { score: 100, weight: "15%" },
  },
};

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  return (
    <ActivityContext.Provider
      value={{
        heatmap: HEATMAP,
        recentLogs: LOGS,
        dailyScore: SCORE,
        loadingHeatmap: false,
        loadingRecent: false,
        refreshAll: () => {},
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be inside ActivityProvider");
  return ctx;
}
