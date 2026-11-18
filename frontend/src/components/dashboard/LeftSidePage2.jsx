import { Check, Trash2, Clock3, ListChecks, ChartNoAxesColumn } from "lucide-react";
import { useEffect, useState } from "react";
import taskApi from "../../api/task.api";

const INITIAL_TASKS = [
  { id: "1", title: "Review product design specs & wireframes", category: "Work", isDone: true, time: "9:00 AM" },
  { id: "2", title: "Implement LifeSync dashboard Page 2 UI", category: "Dev", isDone: true, time: "11:30 AM" },
  { id: "3", title: "Daily 30-min cardio & mindful walk", category: "Health", isDone: false, time: "5:00 PM" },
  { id: "4", title: "Write evening journal reflection on weekly goals", category: "Personal", isDone: false, time: "7:30 PM" },
  { id: "5", title: "Audit expenses and categorize monthly subscriptions", category: "Finance", isDone: false, time: "Tomorrow" },
  { id: "6", title: "Plan upcoming sprint focus & review team PRs", category: "Work", isDone: false, time: "Tomorrow" },
];

const LeftSidePage2 = () => {
  const [tasks, setTasks] = useState(() => {
    try { const saved = localStorage.getItem("lifesync_tasks"); return saved ? JSON.parse(saved) : INITIAL_TASKS; }
    catch { return INITIAL_TASKS; }
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
      } catch (err) { console.warn("Could not fetch tasks from backend, using cached state:", err?.message); }
    };
    fetchTasks();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem("lifesync_tasks", JSON.stringify(tasks)); }
    catch (err) { console.error("Failed to save tasks:", err); }
  }, [tasks]);

  const toggleTask = async (id) => {
    const target = tasks.find((task) => task.id === id || task._id === id);
    const newStatus = !target?.isDone;
    setTasks((prev) => prev.map((task) => task.id === id || task._id === id ? { ...task, isDone: newStatus, status: newStatus ? "completed" : "pending" } : task));
    try { await taskApi.updateTask(id, { isDone: newStatus }); }
    catch (err) { console.warn("Failed to sync task status to backend:", err?.message); }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id && task._id !== id));
    try { await taskApi.deleteTask(id); }
    catch (err) { console.warn("Failed to delete task on backend:", err?.message); }
  };

  const clearCompleted = async () => {
    setTasks((prev) => prev.filter((task) => !task.isDone));
    try { await taskApi.clearCompleted(); }
    catch (err) { console.warn("Failed to clear completed tasks:", err?.message); }
  };

  const completedCount = tasks.filter((task) => task.isDone).length;
  const pendingCount = tasks.length - completedCount;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending" || filter === "process") return !task.isDone;
    if (filter === "completed") return task.isDone;
    return true;
  });
  const categoryColor = { Work: "#5795e6", Dev: "#42a77b", Personal: "#b16ce5", Health: "#ed6574", Finance: "#f0a23c" };

  return (
    <section className="glass-card card-hover tasks-card" aria-label="Tasks">
      <div className="tasks-header">
        <div className="tasks-heading">
          <div className="heading-icon"><ListChecks size={27} /></div>
          <div><h1>Tasks</h1><p>Stay productive, one task at a time</p></div>
        </div>
        <div className="filter-pills" role="group" aria-label="Filter tasks">
          {[{ id: "all", label: `All (${tasks.length})` }, { id: "pending", label: `Pending (${pendingCount})` }, { id: "process", label: `Process (${pendingCount})` }, { id: "completed", label: `Done (${completedCount})` }].map((item) => (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={filter === item.id ? "active" : ""}>{item.label}</button>
          ))}
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div style={{ flex: 1, display: "grid", placeContent: "center", textAlign: "center", color: "#988b91" }}>
            <ListChecks size={34} style={{ margin: "0 auto 10px", opacity: .5 }} />
            <strong style={{ fontFamily: "Marcellus", fontWeight: 400 }}>No tasks found</strong>
            <span style={{ fontSize: 12, marginTop: 5 }}>{filter === "completed" ? "No completed tasks yet" : "All tasks are completed!"}</span>
          </div>
        ) : filteredTasks.map((task) => {
          const taskId = task.id || task._id;
          const accent = categoryColor[task.category] || "#ff9d32";
          return (
            <article key={taskId} className={`task-row ${task.isDone ? "done" : ""}`} style={{ "--task-accent": accent }}>
              <button type="button" className={`task-check ${task.isDone ? "checked" : ""}`} onClick={() => toggleTask(taskId)} aria-label={task.isDone ? "Mark pending" : "Mark completed"}>
                {task.isDone && <Check size={15} strokeWidth={3} />}
              </button>
              <div className="task-copy">
                <p className="task-title">{task.title}</p>
                <div className="task-meta">
                  <span className={`category-chip ${task.category || "Work"}`}>{task.category || "General"}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock3 size={12} />{task.time || task.dueDate || "Today"}</span>
                </div>
              </div>
              <button type="button" className="task-delete" onClick={() => deleteTask(taskId)} aria-label="Delete task"><Trash2 size={16} /></button>
            </article>
          );
        })}
      </div>

      <div className="task-footer">
        <div className="progress-icon"><ChartNoAxesColumn size={19} /></div>
        <div className="progress-copy">
          <div className="progress-label"><span>Daily Completion Rate</span><strong>{progressPct}%</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
        </div>
        {completedCount > 0 && <button type="button" className="clear-done" onClick={clearCompleted}>Clear done</button>}
      </div>
    </section>
  );
};

export default LeftSidePage2;
