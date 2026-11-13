import apiClient from "./apiClient";

export const taskApi = {
  getTasks: async (status = "all") => {
    const params = status && status !== "all" ? { status } : {};
    const res = await apiClient.get("/tasks", { params });
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await apiClient.post("/tasks", taskData);
    return res.data;
  },

  updateTask: async (taskId, updates) => {
    const res = await apiClient.patch(`/tasks/${taskId}`, updates);
    return res.data;
  },

  deleteTask: async (taskId) => {
    const res = await apiClient.delete(`/tasks/${taskId}`);
    return res.data;
  },

  clearCompleted: async () => {
    const res = await apiClient.delete("/tasks/clear-completed");
    return res.data;
  },
};

export default taskApi;
