import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import {
  setLoading as setLoadingAction,
  setError as setErrorAction,
  setHistory as setHistoryAction,
  setQuickPrompts as setQuickPromptsAction
} from "../../../store/features/ai/aiSlice";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
});

export const useAi = () => {
  const loading = useSelector((state: RootState) => state.ai.loading);
  const history = useSelector((state: RootState) => state.ai.history);

  const dispatch = useDispatch();

  const setLoading = (loading: boolean) => {
    dispatch(setLoadingAction(loading));
  };

  const setError = (error: string | null) => {
    dispatch(setErrorAction(error));
  };

  const setHistory = (history: string[]) => {
    dispatch(setHistoryAction(history));
  };

  const setQuickPrompts = (quickPrompts: string[]) => {
    dispatch(setQuickPromptsAction(quickPrompts));
  };

  const getRes = async (prompt: string) => {
    try {
      setLoading(true);

      const response = await api.post("/chat", { prompt });
      const data = response.data;

      setHistory(data.history);
      setQuickPrompts(data.quickPrompts);

    } catch (error: any) {
      setError(error.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, history, getRes };
};
