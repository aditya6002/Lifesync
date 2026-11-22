import {
  Check,
  Trash2,
  Clock3,
  ListChecks,
  ChartNoAxesColumn,
} from "lucide-react";
import { useEffect, useState } from "react";
import taskApi from "../../api/task.api";

const INITIAL_TASKS = [
  {
    id: "1",
    title: "Review product design specs & wireframes",
    category: "Work",
    isDone: true,
    time: "9:00 AM",
  },
  {
    id: "2",
    title: "Implement LifeSync dashboard Page 2 UI",
    category: "Dev",
    isDone: true,
    time: "11:30 AM",
  },
  {
    id: "3",
    title: "Daily 30-min cardio & mindful walk",
    category: "Health",
    isDone: false,
    time: "5:00 PM",
  },
  {
    id: "4",
    title: "Write evening journal reflection on weekly goals",
    category: "Personal",
    isDone: false,
    time: "7:30 PM",
  },
  {
    id: "5",
    title: "Audit expenses and categorize monthly subscriptions",
    category: "Finance",
    isDone: false,
    time: "Tomorrow",
  },
  {
    id: "6",
    title: "Plan upcoming sprint focus & review team PRs",
    category: "Work",
    isDone: false,
    time: "Tomorrow",
  },
];

const LeftSidePage2 = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_tasks");
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        const data = await taskApi.getTasks();
        if (isMounted && data?.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
          localStorage.setItem("lifesync_tasks", JSON.stringify(data.tasks));
        }
      } catch (err) {
        console.warn("Could not fetch tasks from backend:", err?.message);
      }
    };
    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lifesync_tasks", JSON.stringify(tasks));
    } catch (err) {
      console.error("Failed to save tasks:", err);
    }
  }, [tasks]);

  const toggleTask = async (id) => {
    const target = tasks.find((task) => task.id === id || task._id === id);
    const newStatus = !target?.isDone;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id || task._id === id
          ? {
              ...task,
              isDone: newStatus,
              status: newStatus ? "completed" : "pending",
            }
          : task
      )
    );
    try {
      await taskApi.updateTask(id, { isDone: newStatus });
    } catch (err) {
      console.warn("Failed to sync task status to backend:", err?.message);
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id && task._id !== id)
    );
    try {
      await taskApi.deleteTask(id);
    } catch (err) {
      console.warn("Failed to delete task on backend:", err?.message);
    }
  };

  const clearCompleted = async () => {
    setTasks((prev) => prev.filter((task) => !task.isDone));
    try {
      await taskApi.clearCompleted();
    } catch (err) {
      console.warn("Failed to clear completed tasks:", err?.message);
    }
  };

  const completedCount = tasks.filter((task) => task.isDone).length;
  const pendingCount = tasks.length - completedCount;
  const progressPct = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending" || filter === "process") return !task.isDone;
    if (filter === "completed") return task.isDone;
    return true;
  });

  return (
    <section
      className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/20 flex flex-col gap-5 min-h-[520px]"
      aria-label="Tasks"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ListChecks size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
              Tasks
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Stay productive, one task at a time
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: `All (${tasks.length})` },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "completed", label: `Done (${completedCount})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filter === item.id
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                  : "bg-white/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-zinc-400 dark:text-zinc-500 gap-1.5">
            <ListChecks size={28} className="opacity-40 mb-1" />
            <strong className="font-serif text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No tasks found
            </strong>
            <span className="text-xs">
              {filter === "completed" ? "No completed tasks yet" : "All caught up with your tasks!"}
            </span>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const taskId = task.id || task._id;
            return (
              <article
                key={taskId}
                className={`group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/60 shadow-sm transition-all ${
                  task.isDone ? "opacity-60" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(taskId)}
                  aria-label={task.isDone ? "Mark pending" : "Mark completed"}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.isDone
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-zinc-300 dark:border-zinc-600 hover:border-emerald-500"
                  }`}
                >
                  {task.isDone && <Check size={13} strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium text-zinc-900 dark:text-white truncate ${
                      task.isDone ? "line-through text-zinc-400 dark:text-zinc-500" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {task.category || "General"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={11} />
                      {task.time || task.dueDate || "Today"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(taskId)}
                  aria-label="Delete task"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </article>
            );
          })
        )}
      </div>

      {/* Progress Footer */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/50 mt-auto">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ChartNoAxesColumn size={17} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-zinc-600 dark:text-zinc-400">Daily Completion</span>
              <strong className="text-zinc-900 dark:text-white">{progressPct}%</strong>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="text-xs font-semibold text-zinc-500 hover:text-rose-600 transition-colors whitespace-nowrap"
          >
            Clear done
          </button>
        )}
      </div>
    </section>
  );
};

export default LeftSidePage2;
