import apiClient from "./apiClient";

export const noteApi = {
  getNotes: async () => {
    const res = await apiClient.get("/notes");
    return res.data;
  },

  createNote: async (noteData) => {
    const res = await apiClient.post("/notes", noteData);
    return res.data;
  },

  updateNote: async (noteId, updates) => {
    const res = await apiClient.patch(`/notes/${noteId}`, updates);
    return res.data;
  },

  deleteNote: async (noteId) => {
    const res = await apiClient.delete(`/notes/${noteId}`);
    return res.data;
  },
};

export default noteApi;
