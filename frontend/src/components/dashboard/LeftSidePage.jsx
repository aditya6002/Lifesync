import { MoveLeft, MoveRight } from "lucide-react";
import { useMemo, useState } from "react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

const LeftSidePage = () => {
  // Single source of truth: the first day of the month being viewed.
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();

  // Everything else is derived, so there is no extra state to keep in sync.
  const cells = useMemo(() => {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const blanks = Array.from({ length: firstWeekday }, () => null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return [...blanks, ...days];
  }, [year, monthIndex]);

  const changeMonth = (offset) => {
    // Always based on the month currently shown, not today's date.
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  };

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    monthIndex === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="left w-[40%] h-11/12 bg-white rounded-3xl p-4">
      <div className="h-full w-full bg-pink-200">
        <div className="flex items-center justify-between px-12 py-2 mb-12">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <MoveLeft />
          </button>
          <h1 className="text-2xl font-semibold">
            {MONTH_NAMES[monthIndex]} {year}
          </h1>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            <MoveRight />
          </button>
        </div>

        <div className="grid grid-cols-7 w-full bg-amber-300 px-12 text-center font-medium h-1/12 gap-2">
          {WEEKDAYS.map(({ key, label }) => (
            <span key={key}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 w-full bg-amber-300 px-12 text-center h-8/12 gap-2">
          {cells.map((day, index) => (
            <span
              key={`${year}-${monthIndex}-${index}`}
              className={
                isToday(day) ? "font-bold bg-pink-400 rounded-full" : ""
              }
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidePage;
