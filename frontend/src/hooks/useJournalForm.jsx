import { useSelector, useDispatch } from "react-redux";
import { setLoading, setError } from "../store/features/journalSlice";
import { useEffect } from "react";
import journalApi from "../api/journal.route";

export function useJournalForm() {
  const { loading, error } = useSelector((state) => state.journal);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getAndSetJournal() {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const res = journalApi.getAllJournal(2, 2026);
        console.dir(res);
      } catch (error) {
        console.dir("Journal Error", error);
      } finally {
        dispatch(setLoading(false));
      }
    }

    getAndSetJournal();
  }, []);

  return { loading, setLoading, error, setError };
}
