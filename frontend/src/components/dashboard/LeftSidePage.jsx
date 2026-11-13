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

const firstOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const LeftSidePage = () => {
  const [viewDate, setViewDate] = useState(() => firstOfMonth(new Date()));
  const [selected, setSelected] = useState(null); // "YYYY-M-D"

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
  }, [year, monthIndex]);

  const changeMonth = (offset) =>
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );

  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && monthIndex === today.getMonth();
  const dayKey = (day) => `${year}-${monthIndex + 1}-${day}`;
  const isToday = (day) => isCurrentMonth && day === today.getDate();

  const arrowBtn =
    "p-2 rounded-full hover:bg-white/60 active:scale-95 transition cursor-pointer";

  return (
    <div className="left w-[40%] h-11/12 bg-white rounded-3xl p-4">
      <div className="h-full w-full rounded-2xl p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className={arrowBtn}
          >
            <MoveLeft />
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold select-none">
              {MONTH_NAMES[monthIndex]} {year}
            </h1>
            {/* jump back when you've navigated away from this month */}
            <button
              type="button"
              onClick={() => setViewDate(firstOfMonth(new Date()))}
              className={`mt-1 text-xs px-3 py-0.5 rounded-full bg-black/70 text-white hover:bg-black transition cursor-pointer select-none ${
                isCurrentMonth ? "invisible" : ""
              }`}
            >
              Today
            </button>
          </div>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className={arrowBtn}
          >
            <MoveRight />
          </button>
        </div>

        {/* Weekdays + days in one card so rows spread evenly */}
        <div className="flex-1 mt-3 rounded-2xl p-3 flex flex-col">
          <div className="grid grid-cols-7 text-center text-sm font-semibold pb-2 select-none">
            {WEEKDAYS.map(({ key, label }, i) => (
              <span
                key={key}
                className={i === 0 ? "text-red-600" : "text-black/70"}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 auto-rows-fr place-items-center">
            {cells.map((day, index) => {
              if (!day) return <span key={`blank-${index}`} />;

              const isSelected = selected === dayKey(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelected(dayKey(day))}
                  className={[
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm transition  cursor-pointer select-none",
                    index % 7 === 0 ? "text-red-600" : "",
                    isSelected
                      ? "bg-black text-white font-semibold"
                      : isToday(day)
                        ? "ring-2 ring-gray-500 font-bold"
                        : "hover:bg-gray-200",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-4 flex justify-center items-center gap-3">
          {[
            { name: "Journal", color: "purple" },
            { name: "Expenses", color: "sky" },
            { name: "Tasks", color: "green" },
            { name: "Notes", color: "yellow" },
          ].map((item) => {
            return (
              <div className="flex justify-center items-center gap-1">
                <div
                  className={`h-2 w-2 bg-${item.color}-500 rounded-full`}
                ></div>
                <p className="text-xs font-black">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidePage;
