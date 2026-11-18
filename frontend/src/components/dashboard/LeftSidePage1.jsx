import { CalendarDays, CheckCircle2, FileText, NotebookPen, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const firstOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const LeftSidePage = () => {
  const [viewDate, setViewDate] = useState(() => firstOfMonth(new Date()));
  const [selected, setSelected] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  });
  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const cells = useMemo(() => {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    return [...Array.from({ length: firstWeekday }, () => null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
  }, [year, monthIndex]);
  const changeMonth = (offset) => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();
  const dayKey = (day) => `${year}-${monthIndex + 1}-${day}`;

  const shortcuts = [
    { name: "Journal", Icon: NotebookPen, color: "#8a4add" },
    { name: "Expenses", Icon: Wallet, color: "#e99731" },
    { name: "Tasks", Icon: CheckCircle2, color: "#6a9f4d" },
    { name: "Notes", Icon: FileText, color: "#5792dc" },
  ];

  return (
    <section className="glass-card card-hover calendar-card" aria-label="Calendar">
      <div className="calendar-head">
        <div className="calendar-icon"><CalendarDays size={26} /></div>
        <div>
          <h1 className="calendar-title">{MONTH_NAMES[monthIndex]} {year}</h1>
          {!isCurrentMonth && <button type="button" onClick={() => setViewDate(firstOfMonth(new Date()))} style={{ border: 0, background: "transparent", color: "#a76b2d", fontSize: 11 }}>Back to today</button>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="round-icon-btn" aria-label="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
          <button type="button" className="round-icon-btn" aria-label="Next month" onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-days">
        {cells.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;
          const key = dayKey(day);
          const isSelected = selected === key;
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-pressed={isSelected}
              className={`calendar-day ${index % 7 === 0 ? "sunday" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
            >{day}</button>
          );
        })}
      </div>
      <div className="calendar-shortcuts">
        {shortcuts.map(({ name, Icon, color }) => (
          <button type="button" className="shortcut-pill" key={name}>
            <Icon size={15} color={color} strokeWidth={2.3} />{name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default LeftSidePage;
