// src/features/notes/notes.context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Note, NoteFormData } from "../../shared/types";
import { notesApi } from "./notes.api";
import { activityApi } from "../activity/activity.api";

interface NotesContextType {
  notes:   Note[];
  loading: boolean;
  create:  (data: NoteFormData) => Promise<Note>;
  update:  (id: string, data: Partial<NoteFormData>) => Promise<void>;
  remove:  (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes,   setNotes]   = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notesApi.getAll()
      .then(res => setNotes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const create = async (data: NoteFormData): Promise<Note> => {
    const res = await notesApi.create(data);
    setNotes(prev => [res.data, ...prev]);
    await activityApi.log({ module:"notes", action:"created", entityId:res.data.id, entityName:res.data.title, meta:{ tag:res.data.tag } });
    return res.data;
  };

  const update = async (id: string, data: Partial<NoteFormData>): Promise<void> => {
    const res = await notesApi.update(id, data);
    setNotes(prev => prev.map(n => n.id === id ? res.data : n));
    await activityApi.log({ module:"notes", action:"updated", entityId:id, entityName:res.data.title });
  };

  const remove = async (id: string): Promise<void> => {
    const note = notes.find(n => n.id === id);
    await notesApi.remove(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    await activityApi.log({ module:"notes", action:"deleted", entityId:id, entityName:note?.title ?? "Note" });
  };

  return (
    <NotesContext.Provider value={{ notes, loading, create, update, remove }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes(): NotesContextType {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be inside NotesProvider");
  return ctx;
}
