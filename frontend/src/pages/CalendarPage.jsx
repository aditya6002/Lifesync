import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import activityApi from "../api/activity.api";
import taskApi from "../api/task.api";
import CalendarHeader from "../components/calendar/CalendarHeader";
import CalendarPulseStats from "../components/calendar/CalendarPulseStats";
import CalendarGrid from "../components/calendar/CalendarGrid";
import ActivityInspector from "../components/calendar/ActivityInspector";

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
  const month = currentDate.getMonth();

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
      console.warn("Could not fetch month activities:", err?.message);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonthActivity();
  }, [fetchMonthActivity]);

  // Calendar cells
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
      console.warn("Failed to toggle task:", e?.message);
    }
  };

  return (
    <div className="flex flex-col gap-6" aria-label="LifeSync Calendar">
      {/* Header */}
      <CalendarHeader
        onTodayClick={jumpToToday}
        onRefreshClick={fetchMonthActivity}
        loading={loading}
      />

      {/* Monthly Pulse Stats */}
      <CalendarPulseStats counts={counts} />

      {/* Main Grid: Calendar on Left, Day Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <CalendarGrid
            year={year}
            month={month}
            cells={cells}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onChangeMonth={changeMonth}
            monthlyData={monthlyData}
            today={today}
            isCurrentMonth={isCurrentMonth}
            getDateKey={getDateKey}
          />
        </div>

        <div className="lg:col-span-5">
          <ActivityInspector
            selectedDate={selectedDate}
            selectedDayActivity={selectedDayActivity}
            totalSelectedActivities={totalSelectedActivities}
            activityFilter={activityFilter}
            setActivityFilter={setActivityFilter}
            onToggleTask={handleToggleTask}
            onNavigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
