import apiClient from "./apiClient";

const activityApi = {
  // Get monthly activity aggregation
  getMonthlyActivity: async (year, month) => {
    const res = await apiClient.get("/activity/month", {
      params: { year, month },
    });
    return res.data;
  },
};

export default activityApi;
