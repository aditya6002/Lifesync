import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  UserRound,
  IndianRupee,
  Check,
  NotebookText,
  TrendingUp,
} from "lucide-react";

const SECTIONS = [
  {
    name: "Entries",
    data: "12",
    span: "Entries",
    bg: "rgba(136, 69, 232, 0.12)",
    color: "#8845e8",
    Icon: UserRound,
  },
  {
    name: "Expenses",
    data: "₹10,000",
    span: "Expenses",
    bg: "rgba(255, 157, 50, 0.12)",
    color: "#ff9d32",
    Icon: IndianRupee,
  },
  {
    name: "Completed",
    data: "10/12",
    span: "Completed",
    bg: "rgba(16, 185, 129, 0.12)",
    color: "#10b981",
    Icon: Check,
  },
  {
    name: "Notes",
    data: "10",
    span: "Notes",
    bg: "rgba(59, 130, 246, 0.12)",
    color: "#3b82f6",
    Icon: NotebookText,
  },
];

const CHART = {
  w: 120,
  h: 54,
  left: 9,
  right: 115,
  top: 7,
  bottom: 41,
  labelY: 50,
};

const ACTIVITY = [1, 4, 5, 2, 3, 4, 2];
const formatDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const RightSidePage = () => {
  const [page, setPage] = useState(0);

  const visibleDays = useMemo(
    () =>
      ACTIVITY.map((total, index) => {
        const date = new Date(Date.UTC(2023, 5, 14 + index - page * 7));
        return { date, total };
      }),
    [page]
  );

  const canGoNewer = page > 0;
  const points = visibleDays.map(({ date, total }, index) => {
    const x =
      CHART.left +
      (index / Math.max(visibleDays.length - 1, 1)) *
        (CHART.right - CHART.left);
    const y = CHART.bottom - (total / 6) * (CHART.bottom - CHART.top);
    return { date, total, x, y };
  });

  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPath = points.length
    ? `M ${points[0].x},${CHART.bottom} ${points.map(({ x, y }) => `L ${x},${y}`).join(" ")} L ${points[points.length - 1].x},${CHART.bottom} Z`
    : "";
  const totalCount = visibleDays.reduce((sum, day) => sum + day.total, 0);
  const rangeLabel = visibleDays.length
    ? `${formatDate(visibleDays[0].date)} – ${formatDate(visibleDays[visibleDays.length - 1].date)}`
    : "No activity";

  return (
    <section className="flex flex-col gap-5 min-h-[520px]" aria-label="Activity overview">
      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {SECTIONS.map(({ name, data, span, bg, color, Icon }) => (
          <article
            key={name}
            className="p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/20 flex flex-col gap-2 hover:-translate-y-0.5 transition-all"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bg, color }}
            >
              <Icon size={20} strokeWidth={2.2} />
            </div>
            <strong className="font-serif text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
              {data}
            </strong>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {span}
            </span>
          </article>
        ))}
      </div>

      {/* Activity Chart Card */}
      <article className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/20 flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <ChevronLeft size={16} />
            </button>
            <span>{rangeLabel}</span>
            <button
              type="button"
              disabled={!canGoNewer}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-20"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-right">
            <strong className="font-serif text-xl font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent block leading-tight">
              {totalCount}
            </strong>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Activities
            </span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          className="w-full h-44 overflow-visible"
          role="img"
          aria-label="Activity chart"
        >
          <defs>
            <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity=".38" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity=".04" />
            </linearGradient>
          </defs>

          {[0, 2, 4, 6].map((value) => {
            const y = CHART.bottom - (value / 6) * (CHART.bottom - CHART.top);
            return (
              <g key={value}>
                <line
                  x1={CHART.left}
                  x2={CHART.right}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeWidth="0.5"
                />
                <text className="text-[2.6px] fill-zinc-400 font-sans" x="3" y={y + 1}>
                  {value}
                </text>
              </g>
            );
          })}

          {points.length > 0 && <path d={areaPath} fill="url(#activityFill)" />}
          {points.length > 1 && (
            <polyline
              points={linePoints}
              fill="none"
              stroke="#8845e8"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {points.map(({ date, total, x, y }) => (
            <g key={date.toISOString()}>
              <circle cx={x} cy={y} r="1.5" fill="#8845e8" />
              <text
                x={x}
                y={y - 3}
                textAnchor="middle"
                className="text-[2.6px] font-bold fill-zinc-800 dark:fill-zinc-200"
              >
                {total}
              </text>
              <text
                x={x}
                y={CHART.labelY}
                textAnchor="middle"
                className="text-[2.4px] fill-zinc-400"
              >
                {formatDate(date)}
              </text>
            </g>
          ))}
        </svg>
      </article>
    </section>
  );
};

export default RightSidePage;
