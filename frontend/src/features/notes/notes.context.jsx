// src/features/notes/notes.context.jsx
import { createContext, useContext, useState } from "react";
import { uid } from "../../shared/utils/helpers";

const DEMO = [
  { id:"n1", title:"Data Structures Notes",   color:"#7C3AED", tag:"Study",    updatedAt:"2h ago",    createdAt:"", userId:"u1", content:"Binary trees:\n- Each node ≤ 2 children\n- AVL balance factor ∈ {-1,0,1}\nRotations: LL→Right, RR→Left\nHeap Sort: O(n log n)" },
  { id:"n2", title:"Project Ideas 2025",       color:"#3b82f6", tag:"Personal", updatedAt:"Yesterday", createdAt:"", userId:"u1", content:"1. AI journal with mood analysis\n2. Expense tracker with ML\n3. Collaborative whiteboard\n4. Habit tracker with streaks" },
  { id:"n3", title:"Atomic Habits Summary",    color:"#f59e0b", tag:"Reading",  updatedAt:"Mar 9",     createdAt:"", userId:"u1", content:"1% Rule: tiny improvements compound.\nHabit Loop: Cue→Craving→Response→Reward\nHabit Stacking: After [X], I will [Y]" },
  { id:"n4", title:"Interview Prep Checklist", color:"#22c55e", tag:"Career",   updatedAt:"Mar 8",     createdAt:"", userId:"u1", content:"System Design: load balancing, sharding, CAP theorem\nDSA: arrays, trees, graphs, DP, sliding window" },
];

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(DEMO);
  const create = async (data) => {
    const n = { ...data, id:uid(), updatedAt:"Just now", createdAt:new Date().toISOString(), userId:"u1" };
    setNotes(p => [n, ...p]); return n;
  };
  const update = async (id, data) => setNotes(p => p.map(n => n.id===id ? {...n,...data,updatedAt:"Just now"} : n));
  const remove = async (id) => setNotes(p => p.filter(n => n.id!==id));
  return (
    <NotesContext.Provider value={{ notes, loading:false, create, update, remove }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be inside NotesProvider");
  return ctx;
}
