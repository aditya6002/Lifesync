// src/features/journal/journal.context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { JournalEntry, JournalFormData } from "../../shared/types";
import { journalApi } from "./journal.api";
import { activityApi } from "../activity/activity.api";

interface JournalContextType {
  entries:  JournalEntry[];
  loading:  boolean;
  create:   (data: JournalFormData) => Promise<JournalEntry>;
  update:   (id: string, data: Partial<JournalFormData>) => Promise<void>;
  remove:   (id: string) => Promise<void>;
  streak:   number;
}

const JournalContext = createContext<JournalContextType | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journalApi.getAll()
      .then(res => setEntries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const create = async (data: JournalFormData): Promise<JournalEntry> => {
    const res = await journalApi.create(data);
    setEntries(prev => [res.data, ...prev]);

    await activityApi.log({
      module:     "journal",
      action:     "created",
      entityId:   res.data.id,
      entityName: res.data.title || `Journal Entry — ${res.data.date}`,
      meta:       { mood: res.data.mood, date: res.data.date },
    });

    return res.data;
  };

  const update = async (id: string, data: Partial<JournalFormData>): Promise<void> => {
    const res = await journalApi.update(id, data);
    setEntries(prev => prev.map(e => e.id === id ? res.data : e));

    await activityApi.log({
      module: "journal", action: "updated",
      entityId: id, entityName: res.data.title,
      meta: { mood: res.data.mood },
    });
  };

  const remove = async (id: string): Promise<void> => {
    const entry = entries.find(e => e.id === id);
    await journalApi.remove(id);
    setEntries(prev => prev.filter(e => e.id !== id));

    await activityApi.log({
      module: "journal", action: "deleted",
      entityId: id, entityName: entry?.title ?? "Journal Entry",
    });
  };

  // Calculate streak (consecutive days with an entry)
  const streak = (() => {
    const dates = new Set(entries.map(e => e.date));
    let count = 0;
    const d = new Date();
    while (dates.has(d.toISOString().slice(0, 10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  return (
    <JournalContext.Provider value={{ entries, loading, create, update, remove, streak }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal(): JournalContextType {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be inside JournalProvider");
  return ctx;
}
