// src/features/subscription/subscription.context.jsx
import { createContext, useContext, useState } from "react";

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    color: "#64748b",
    badge: "Free",
    features: {
      expensesPerMonth: 20,
      expenseHistory: 1,
      expenseExport: false,
      budgetAlerts: false,
      journalEntries: 10,
      moodAnalytics: false,
      journalHistory: 1,
      notesTotal: 10,
      notesFolders: 2,
      aiSummarize: false,
      tasksPerMonth: 20,
      taskReminders: false,
      aiMessagesPerDay: 0,
      aiAssistant: false,
      aiInsights: false,
      aiWeeklyReport: false,
      profileCustomize: false,
      prioritySupport: false,
      dataExport: false,
      streakAnalytics: false,
    },
  },
  student: {
    id: "student",
    name: "Student",
    price: 49,
    yearlyPrice: 399,
    color: "#3b82f6",
    badge: "Student",
    features: {
      expensesPerMonth: 100,
      expenseHistory: 6,
      expenseExport: true,
      budgetAlerts: true,
      journalEntries: -1,
      moodAnalytics: true,
      journalHistory: 6,
      notesTotal: 100,
      notesFolders: 10,
      aiSummarize: true,
      tasksPerMonth: -1,
      taskReminders: true,
      aiMessagesPerDay: 20,
      aiAssistant: true,
      aiInsights: true,
      aiWeeklyReport: false,
      profileCustomize: true,
      prioritySupport: false,
      dataExport: true,
      streakAnalytics: true,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 149,
    yearlyPrice: 999,
    color: "#7C3AED",
    badge: "Pro ✦",
    features: {
      expensesPerMonth: -1,
      expenseHistory: -1,
      expenseExport: true,
      budgetAlerts: true,
      journalEntries: -1,
      moodAnalytics: true,
      journalHistory: -1,
      notesTotal: -1,
      notesFolders: -1,
      aiSummarize: true,
      tasksPerMonth: -1,
      taskReminders: true,
      aiMessagesPerDay: -1,
      aiAssistant: true,
      aiInsights: true,
      aiWeeklyReport: true,
      profileCustomize: true,
      prioritySupport: true,
      dataExport: true,
      streakAnalytics: true,
    },
  },
};

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [planId, setPlanId] = useState("free");
  const plan = PLANS[planId];

  const upgradeTo = (id) => setPlanId(id);

  const can = (feature) => {
    const val = plan.features[feature];
    // if (typeof val === "boolean") return val;
    // if (typeof val === "number") return val !== 0;
    return false;
  };

  const limit = (feature) => {
    const val = plan.features[feature];
    return typeof val === "number" ? val : val ? -1 : 0;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        planId,
        upgradeTo,
        can,
        limit,
        isPro: planId === "pro",
        isStudent: planId === "student",
        isFree: planId === "free",
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx)
    throw new Error("useSubscription must be inside SubscriptionProvider");
  return ctx;
}
