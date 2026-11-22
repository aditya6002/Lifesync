import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Wallet,
  FileText,
  Plus,
  RefreshCw,
  ArrowRight,
  Smile,
  Check,
  Calendar as CalendarIcon,
  Activity,
  Layers,
} from "lucide-react";
import activityApi from "../api/activity.api";
import taskApi from "../api/task.api";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const [monthlyData, setMonthlyData] = useState({});
  const [counts, setCounts] = useState({ journals: 0, tasks: 0, expenses: 0, notes: 0 });
  const [loading, setLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Fetch month activity from backend
  const fetchMonthActivity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await activityApi.getMonthlyActivity(year, month + 1);
      if (res?.success && res.activities) {
        setMonthlyData(res.activities);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      console.warn("Could not fetch month activities from backend, using current view:", err?.message);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonthActivity();
  }, [fetchMonthActivity]);

  // Calendar cells generation
  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
  }, [year, month]);

  const changeMonth = (offset) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setSelectedDate(`${y}-${m}-${d}`);
  };

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const getDateKey = (day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Selected Day's activities
  const selectedDayActivity = useMemo(() => {
    const data = monthlyData[selectedDate];
    if (!data) return { journals: [], tasks: [], expenses: [], notes: [] };
    return {
      journals: data.journals || [],
      tasks: data.tasks || [],
      expenses: data.expenses || [],
      notes: data.notes || [],
    };
  }, [monthlyData, selectedDate]);

  const totalSelectedActivities =
    selectedDayActivity.journals.length +
    selectedDayActivity.tasks.length +
    selectedDayActivity.expenses.length +
    selectedDayActivity.notes.length;

  // Toggle task status
  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await taskApi.updateTask(taskId, { isDone: !currentStatus });
      setMonthlyData((prev) => {
        const updated = { ...prev };
        if (updated[selectedDate]?.tasks) {
          updated[selectedDate].tasks = updated[selectedDate].tasks.map((t) =>
            t.id === taskId ? { ...t, isDone: !currentStatus } : t
          );
        }
        return updated;
      });
    } catch (e) {
      console.warn("Failed to toggle task status:", e?.message);
    }
  };

  return (
    <div className="calendar-page-wrap" aria-label="LifeSync Calendar">
      {/* Page Header
      <header className="calendar-header glass-card">
        <div className="calendar-header-left">
          <div className="hero-pill-badge bouncing" style={{ marginBottom: 10 }}>
            <Sparkles size={13} className="hero-pill-icon" />
            <span>REAL-TIME CHRONO VAULT</span>
            <span className="bright-moment-dot" />
          </div>
          <h1 className="calendar-page-title">
            Activity & Timeflow <span className="hero-gradient-text">Calendar</span>
          </h1>
          <p className="calendar-page-subtitle">
            Synchronize your reflections, tasks, expenses, and notes into one unified, color-coded daily timeline.
          </p>
        </div>

        <div className="calendar-header-actions">
          <button type="button" onClick={jumpToToday} className="round-pill-btn">
            <CalendarIcon size={15} />
            <span>Today</span>
          </button>
          <button
            type="button"
            onClick={fetchMonthActivity}
            className={`round-icon-btn ${loading ? "jnl-spin" : ""}`}
            title="Refresh Activities"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header> */}

      {/* Monthly Pulse Stats Strip */}
      <section className="calendar-pulse-strip glass-card" aria-label="Month activity stats">
        <div className="pulse-stat-item">
          <span className="pulse-stat-dot purple" />
          <div className="pulse-stat-text">
            <strong>{counts.journals}</strong>
            <span>Journals Written</span>
          </div>
        </div>
        <div className="pulse-stat-divider" />
        <div className="pulse-stat-item">
          <span className="pulse-stat-dot green" />
          <div className="pulse-stat-text">
            <strong>{counts.tasks}</strong>
            <span>Tasks Scheduled</span>
          </div>
        </div>
        <div className="pulse-stat-divider" />
        <div className="pulse-stat-item">
          <span className="pulse-stat-dot orange" />
          <div className="pulse-stat-text">
            <strong>{counts.expenses}</strong>
            <span>Expenses Tracked</span>
          </div>
        </div>
        <div className="pulse-stat-divider" />
        <div className="pulse-stat-item">
          <span className="pulse-stat-dot blue" />
          <div className="pulse-stat-text">
            <strong>{counts.notes}</strong>
            <span>Notes Jotted</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Calendar Grid on Left, Day Inspector on Right */}
      <div className="calendar-main-grid">
        {/* Left: Interactive Calendar Card */}
        <section className="calendar-grid-card glass-card">
          {/* Month Navigation */}
          <div className="calendar-nav-bar">
            <div className="calendar-current-label">
              <h2 className="calendar-month-name">
                {MONTH_NAMES[month]} <span className="hero-gradient-text">{year}</span>
              </h2>
            </div>
            <div className="calendar-nav-btns">
              <button
                type="button"
                className="round-icon-btn"
                onClick={() => changeMonth(-1)}
                aria-label="Previous Month"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="round-icon-btn"
                onClick={() => changeMonth(1)}
                aria-label="Next Month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="calendar-weekdays-row">
            {WEEKDAYS.map((day) => (
              <span key={day} className="calendar-weekday-label">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="calendar-days-container">
            {cells.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="calendar-day-cell empty" />;

              const dateKey = getDateKey(day);
              const isSelected = selectedDate === dateKey;
              const isCurrentDay = isCurrentMonth && day === today.getDate();
              const dayActivities = monthlyData[dateKey];

              const hasJournals = dayActivities?.journals?.length > 0;
              const hasTasks = dayActivities?.tasks?.length > 0;
              const hasExpenses = dayActivities?.expenses?.length > 0;
              const hasNotes = dayActivities?.notes?.length > 0;
              const totalEvents =
                (dayActivities?.journals?.length || 0) +
                (dayActivities?.tasks?.length || 0) +
                (dayActivities?.expenses?.length || 0) +
                (dayActivities?.notes?.length || 0);

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`calendar-day-cell ${index % 7 === 0 ? "sunday" : ""} ${
                    isCurrentDay ? "today" : ""
                  } ${isSelected ? "selected" : ""}`}
                >
                  <span className="day-number">{day}</span>

                  {/* Activity Indicators Dots */}
                  <div className="day-activity-dots">
                    {hasJournals && <span className="activity-dot dot-purple" title="Journal logged" />}
                    {hasTasks && <span className="activity-dot dot-green" title="Task scheduled" />}
                    {hasExpenses && <span className="activity-dot dot-orange" title="Expense recorded" />}
                    {hasNotes && <span className="activity-dot dot-blue" title="Note captured" />}
                  </div>

                  {totalEvents > 0 && <span className="day-event-count">{totalEvents}</span>}
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="calendar-legend">
            <span className="legend-item"><span className="activity-dot dot-purple" /> Journal</span>
            <span className="legend-item"><span className="activity-dot dot-green" /> Task</span>
            <span className="legend-item"><span className="activity-dot dot-orange" /> Expense</span>
            <span className="legend-item"><span className="activity-dot dot-blue" /> Note</span>
          </div>
        </section>

        {/* Right: Selected Day Activity Inspector */}
        <aside className="calendar-inspector-panel glass-card">
          <div className="inspector-head">
            <div className="icon-box icon-box-purple">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="inspector-title">Daily Activity Log</h2>
              <span className="inspector-date">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="inspector-badge">
              {totalSelectedActivities} {totalSelectedActivities === 1 ? "event" : "events"}
            </span>
          </div>

          {/* Activity Filters */}
          <div className="inspector-filter-tabs">
            <button
              type="button"
              className={`inspector-tab ${activityFilter === "all" ? "active" : ""}`}
              onClick={() => setActivityFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`inspector-tab ${activityFilter === "journal" ? "active" : ""}`}
              onClick={() => setActivityFilter("journal")}
            >
              Journals ({selectedDayActivity.journals.length})
            </button>
            <button
              type="button"
              className={`inspector-tab ${activityFilter === "task" ? "active" : ""}`}
              onClick={() => setActivityFilter("task")}
            >
              Tasks ({selectedDayActivity.tasks.length})
            </button>
            <button
              type="button"
              className={`inspector-tab ${activityFilter === "expense" ? "active" : ""}`}
              onClick={() => setActivityFilter("expense")}
            >
              Expenses ({selectedDayActivity.expenses.length})
            </button>
          </div>

          {/* Activity Feed */}
          <div className="inspector-feed">
            {totalSelectedActivities === 0 ? (
              <div className="inspector-empty">
                <CalendarDays size={38} className="inspector-empty-icon" />
                <h3>No activity logged for this day</h3>
                <p>Pick another day on the calendar or jump into Journal or Tasks to record a reflection.</p>
                <div className="inspector-empty-actions">
                  <button type="button" onClick={() => navigate("/journal")} className="empty-quick-btn">
                    <BookOpen size={14} /> Write Journal
                  </button>
                  <button type="button" onClick={() => navigate("/expenses")} className="empty-quick-btn">
                    <Wallet size={14} /> Log Expense
                  </button>
                </div>
              </div>
            ) : (
              <div className="inspector-items-stack">
                {/* Journals */}
                {(activityFilter === "all" || activityFilter === "journal") &&
                  selectedDayActivity.journals.map((j) => (
                    <article key={j.id} className="inspector-item-card journal-item">
                      <div className="item-icon-tag purple">
                        <BookOpen size={15} />
                      </div>
                      <div className="item-content">
                        <strong>{j.title || "Untitled Reflection"}</strong>
                        <div className="item-meta">
                          <span>Mood: {j.mood || "Calm 🌿"}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate("/journal")}
                        className="item-link-btn"
                        title="Read entry"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </article>
                  ))}

                {/* Tasks */}
                {(activityFilter === "all" || activityFilter === "task") &&
                  selectedDayActivity.tasks.map((t) => (
                    <article key={t.id} className={`inspector-item-card task-item ${t.isDone ? "done" : ""}`}>
                      <button
                        type="button"
                        onClick={() => handleToggleTask(t.id, t.isDone)}
                        className={`item-check-btn ${t.isDone ? "checked" : ""}`}
                        aria-label="Toggle task"
                      >
                        {t.isDone && <Check size={13} strokeWidth={3} />}
                      </button>
                      <div className="item-content">
                        <strong className={t.isDone ? "line-through opacity-60" : ""}>
                          {t.title || "Daily Task"}
                        </strong>
                        <div className="item-meta">
                          <span className={`priority-pill ${t.priority || "low"}`}>
                            {t.priority || "normal"} priority
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}

                {/* Expenses */}
                {(activityFilter === "all" || activityFilter === "expense") &&
                  selectedDayActivity.expenses.map((e) => (
                    <article key={e.id} className="inspector-item-card expense-item">
                      <div className="item-icon-tag orange">
                        <Wallet size={15} />
                      </div>
                      <div className="item-content">
                        <strong>{e.title}</strong>
                        <div className="item-meta">
                          <span className="cat-chip">{e.category}</span>
                        </div>
                      </div>
                      <strong className={`item-expense-amt ${e.type === "income" ? "income" : "expense"}`}>
                        {e.type === "income" ? "+" : "-"}₹{Number(e.amount).toLocaleString("en-IN")}
                      </strong>
                    </article>
                  ))}

                {/* Notes */}
                {(activityFilter === "all" || activityFilter === "notes") &&
                  selectedDayActivity.notes.map((n) => (
                    <article key={n.id} className="inspector-item-card note-item">
                      <div className="item-icon-tag blue">
                        <FileText size={15} />
                      </div>
                      <div className="item-content">
                        <strong>{n.title}</strong>
                        <div className="item-meta">
                          <span>Tag: {n.tag || "General"}</span>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalendarPage;
