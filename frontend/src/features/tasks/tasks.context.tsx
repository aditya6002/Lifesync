// src/features/tasks/tasks.context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Task, TaskFormData, TaskGroup } from "../../shared/types";
import { tasksApi } from "./tasks.api";
import { activityApi } from "../activity/activity.api";

interface TasksContextType {
  tasks:      Task[];
  loading:    boolean;
  create:     (data: TaskFormData) => Promise<Task>;
  update:     (id: string, data: Partial<TaskFormData>) => Promise<void>;
  toggle:     (id: string) => Promise<void>;
  remove:     (id: string) => Promise<void>;
  byGroup:    (group: TaskGroup) => Task[];
  doneCount:  number;
  totalCount: number;
  pct:        number;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksApi.getAll()
      .then(res => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const create = async (data: TaskFormData): Promise<Task> => {
    const res = await tasksApi.create(data);
    setTasks(prev => [...prev, res.data]);
    await activityApi.log({ module:"tasks", action:"created", entityId:res.data.id, entityName:res.data.title, meta:{ priority:res.data.priority } });
    return res.data;
  };

  const update = async (id: string, data: Partial<TaskFormData>): Promise<void> => {
    const res = await tasksApi.update(id, data);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    await activityApi.log({ module:"tasks", action:"updated", entityId:id, entityName:res.data.title });
  };

  const toggle = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    const res  = await tasksApi.toggle(id);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));

    // Only log when marking as DONE (not undone)
    if (!task?.done) {
      await activityApi.log({
        module:     "tasks",
        action:     "completed",
        entityId:   id,
        entityName: task?.title ?? "Task",
        meta:       { priority: task?.priority },
      });
    }
  };

  const remove = async (id: string): Promise<void> => {
    const task = tasks.find(t => t.id === id);
    await tasksApi.remove(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    await activityApi.log({ module:"tasks", action:"deleted", entityId:id, entityName:task?.title ?? "Task" });
  };

  const byGroup   = (group: TaskGroup) => tasks.filter(t => t.group === group);
  const doneCount  = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <TasksContext.Provider value={{ tasks, loading, create, update, toggle, remove, byGroup, doneCount, totalCount, pct }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextType {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be inside TasksProvider");
  return ctx;
}
