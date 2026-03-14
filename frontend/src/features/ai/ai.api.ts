import axios  from "axios";
import { get } from "http";


const api = axios.create({
  baseURL: "/api/ai",
  headers: {
    "Content-Type": "application/json",
  },
});

export const aiApi = {
  generateContent: (prompt: string) =>
    api.post("/generate", { prompt }).then((res) => res.data).catch((err) => {
        console.error("AI generation error:", err);
    throw err;
}),

    getQuickPrompts: () =>
      api.get("/quick-prompts").then((res) => res.data).catch((err) => {
        console.error("Error fetching quick prompts:", err);
        throw err;
      }),


      getHistory: () =>
        api.get("/history").then((res) => res.data).catch((err) => {
          console.error("Error fetching AI history:", err);
          throw err;
        }),

    getChat:(chatId) =>
      api.get(`/chat/${chatId}`).then((res) => res.data).catch((err) => {
        console.error("Error fetching chat history:", err);
        throw err;
      }),

    sendMessage: (chatId: string, message: string) =>
      api.post(`/chat/${chatId}/message`, { message }).then((res) => res.data).catch((err) => {
        console.error("Error sending chat message:", err);
        throw err;
      }),


      getSummery: (text: string) =>
        api.post("/summarize", { text }).then((res) => res.data).catch((err) => {
          console.error("Error summarizing text:", err);
          throw err;
        }),

};


