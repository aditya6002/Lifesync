// src/features/journal/journal.context.jsx
import { createContext, useContext, useState, useMemo } from "react";
import { uid } from "../../shared/utils/helpers";

const DEMO = [
  {
    id: "j1",
    date: "2026-03-11",
    mood: 4,
    title: "Productive Wednesday",
    content:
      "Had a really productive day. Finished two assignments and finally understood AVL trees. Feeling optimistic.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j2",
    date: "2026-03-10",
    mood: 2,
    title: "Distracted day",
    content:
      "Couldn't focus much. Scrolled for 3 hours. Need to fix sleep schedule.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j3",
    date: "2026-03-09",
    mood: 3,
    title: "Steady progress",
    content:
      "Good gym session. Started Atomic Habits Chapter 3. Decent study session.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j4",
    date: "2026-03-08",
    mood: 1,
    title: "Rough Sunday",
    content:
      "Failed the weekly quiz. Score 4/10. Going to make a proper study plan.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j5",
    date: "2026-02-28",
    mood: 5,
    title: "February wrap-up",
    content:
      "What a month Completed DSA challenge, read 2 books, maintained budget.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j6",
    date: "2026-01-01",
    mood: 5,
    title: "Happy New Year 🎉",
    content:
      "2026 starts today Goals: get internship, build something meaningful, stay healthy.",
    userId: "u1",
    createdAt: "",
  },
];

const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(DEMO);
  const create = async (data) => {
    const e = {
      ...data,
      id: uid(),
      userId: "u1",
      createdAt: new Date().toISOString(),
    };
    setEntries((p) => [e, ...p]);
    return e;
  };
  const update = async (id, data) =>
    setEntries((p) => p.map((e) => (e.id === id ? { ...e, ...data } : e)));
  const remove = async (id) => setEntries((p) => p.filter((e) => e.id !== id));
  const streak = useMemo(() => {
    const dates = new Set(entries.map((e) => e.date));
    let count = 0;
    const d = new Date();
    while (dates.has(d.toISOString().slice(0, 10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [entries]);
  return (
    <JournalContext.Provider
      value={{ entries, loading: false, create, update, remove, streak }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be inside JournalProvider");
  return ctx;
}
