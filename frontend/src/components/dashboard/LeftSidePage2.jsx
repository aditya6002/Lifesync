import { Check, Trash2 } from "lucide-react";
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

const CATEGORY_COLORS = {
  Work: "bg-sky-100 text-sky-800 border-sky-200",
  Dev: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Personal: "bg-purple-100 text-purple-800 border-purple-200",
  Health: "bg-rose-100 text-rose-800 border-rose-200",
  Finance: "bg-amber-100 text-amber-800 border-amber-200",
};

const LeftSidePage2 = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_tasks");
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'process' | 'completed'

  // Fetch tasks from backend API on mount
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
        console.warn("Could not fetch tasks from backend, using cached state:", err?.message);
      }
    };

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("lifesync_tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks:", e);
    }
  }, [tasks]);

  const toggleTask = async (id) => {
    const target = tasks.find((t) => t.id === id || t._id === id);
    const newStatus = target?.isDone ? false : true;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id || t._id === id
          ? { ...t, isDone: newStatus, status: newStatus ? "completed" : "pending" }
          : t
      )
    );

    // Call backend API
    try {
      await taskApi.updateTask(id, { isDone: newStatus });
    } catch (err) {
      console.warn("Failed to sync task status to backend:", err?.message);
    }
  };

  const deleteTask = async (id) => {
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));

    // Call backend API
    try {
      await taskApi.deleteTask(id);
    } catch (err) {
      console.warn("Failed to delete task on backend:", err?.message);
    }
  };

  const clearCompleted = async () => {
    setTasks((prev) => prev.filter((t) => !t.isDone));

    try {
      await taskApi.clearCompleted();
    } catch (err) {
      console.warn("Failed to clear completed tasks on backend:", err?.message);
    }
  };

  const completedCount = tasks.filter((t) => t.isDone).length;
  const pendingCount = tasks.length - completedCount;
  const progressPct =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.isDone;
    if (filter === "process") return !t.isDone;
    if (filter === "completed") return t.isDone;
    return true;
  });

  const getCategoryClass = (cat) => {
    return CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="h-10/12 w-1/2 bg-white rounded-4xl overflow-hidden flex flex-col shadow-xs">
      {/* Header */}
      <div className="py-4.5 px-8 flex justify-between items-center select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold select-none text-black">
            Tasks
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/70 text-black">
            {completedCount}/{tasks.length} Completed
          </span>
        </div>

        {/* 4 filter pill tabs matching user design */}
        <div className="flex items-center gap-0 rounded-full overflow-hidden bg-black text-white">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs font-semibold transition cursor-pointer select-none active:scale-95 ${
              filter === "all" ? "" : "bg-white/60 text-black/80 hover:bg-white"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 text-xs font-semibold transition cursor-pointer select-none active:scale-95 ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-white/60 text-black/80 hover:bg-white"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("process")}
            className={`px-3 py-1 text-xs font-semibold transition cursor-pointer select-none active:scale-95 ${
              filter === "process"
                ? "bg-black text-white"
                : "bg-white/60 text-black/80 hover:bg-white"
            }`}
          >
            Process ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 text-xs font-semibold transition cursor-pointer select-none active:scale-95 ${
              filter === "completed"
                ? "bg-black text-white"
                : "bg-white/60 text-black/80 hover:bg-white"
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="h-full min-h-50 flex flex-col items-center justify-center text-center text-black/40 select-none">
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs text-black/30 mt-1">
              {filter === "completed"
                ? "No completed tasks yet"
                : "All tasks are completed!"}
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const taskId = t.id || t._id;
            return (
              <div
                key={taskId}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#f9f9f9] hover:bg-[#f1f1f1] border border-black/5 transition"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-2">
                  <button
                    type="button"
                    onClick={() => toggleTask(taskId)}
                    aria-label={t.isDone ? "Mark pending" : "Mark completed"}
                    className={`h-5.5 w-5.5 rounded-full flex items-center justify-center transition cursor-pointer select-none shrink-0 ${
                      t.isDone
                        ? "bg-black text-white"
                        : "border-2 border-black/30 hover:border-black bg-white"
                    }`}
                  >
                    {t.isDone && <Check size={13} strokeWidth={3} />}
                  </button>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-sm truncate select-none transition ${
                        t.isDone
                          ? "line-through text-black/40 font-normal"
                          : "text-black font-medium"
                      }`}
                    >
                      {t.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 select-none">
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full border ${getCategoryClass(
                          t.category
                        )}`}
                      >
                        {t.category}
                      </span>
                      <span className="text-[11px] text-black/40">{t.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(taskId)}
                  aria-label="Delete task"
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-black/40 hover:text-red-600 hover:bg-black/5 active:scale-95 transition cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Progress Footer */}
      <div className="px-8 py-4 bg-[#fcfcfc] border-t border-black/5 flex items-center justify-between select-none">
        <div className="flex-1 mr-6">
          <div className="flex justify-between text-xs text-black/70 mb-1.5">
            <span>Daily Completion Rate</span>
            <span className="font-semibold">{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#ececec] rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={clearCompleted}
            className="text-xs text-black/50 hover:text-red-600 transition cursor-pointer underline select-none"
          >
            Clear done
          </button>
        )}
      </div>
    </div>
  );
};

export default LeftSidePage2;
