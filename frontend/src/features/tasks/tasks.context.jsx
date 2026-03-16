// src/features/tasks/tasks.context.jsx
import { createContext, useContext, useState, useMemo } from "react";
import { uid } from "../../shared/utils/helpers";

const DEMO = [
  { id:"t1", title:"Submit DSA assignment",  priority:"high",   due:"2026-03-11", done:false, group:"today",    note:"Chapter 5",     userId:"u1", createdAt:"" },
  { id:"t2", title:"Read DBMS Chapter 7",    priority:"medium", due:"2026-03-11", done:true,  group:"today",    note:"",              userId:"u1", createdAt:"" },
  { id:"t3", title:"Push project to GitHub", priority:"high",   due:"2026-03-12", done:false, group:"tomorrow", note:"Include README", userId:"u1", createdAt:"" },
  { id:"t4", title:"Call parents",           priority:"low",    due:"2026-03-12", done:false, group:"tomorrow", note:"",              userId:"u1", createdAt:"" },
  { id:"t5", title:"Mock interview prep",    priority:"high",   due:"2026-03-15", done:false, group:"upcoming", note:"System design", userId:"u1", createdAt:"" },
  { id:"t6", title:"Pay hostel fees",        priority:"medium", due:"2026-03-16", done:false, group:"upcoming", note:"₹4500 due",     userId:"u1", createdAt:"" },
];

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(DEMO);
  const create = async (data) => {
    const t = { ...data, id:uid(), userId:"u1", createdAt:new Date().toISOString() };
    setTasks(p => [...p, t]); return t;
  };
  const update = async (id, data) => setTasks(p => p.map(t => t.id===id ? {...t,...data} : t));
  const toggle = async (id) => setTasks(p => p.map(t => t.id===id ? {...t,done:!t.done} : t));
  const remove = async (id) => setTasks(p => p.filter(t => t.id!==id));
  const byGroup    = (g) => tasks.filter(t => t.group===g);
  const doneCount  = useMemo(() => tasks.filter(t=>t.done).length, [tasks]);
  const totalCount = tasks.length;
  const pct = totalCount>0 ? Math.round((doneCount/totalCount)*100) : 0;
  return (
    <TasksContext.Provider value={{ tasks, loading:false, create, update, toggle, remove, byGroup, doneCount, totalCount, pct }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be inside TasksProvider");
  return ctx;
}
