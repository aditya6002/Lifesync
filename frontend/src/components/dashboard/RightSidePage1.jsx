import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";

const totalActivity = 10000; // Placeholder for total activity count

const SECTIONS = [
  { name: "Journal", data: "12", span: "Entries", color: "purple" },
  {
    name: "Expenses",
    data: `₹${totalActivity}`,
    span: "Expenses",
    color: "sky",
  },
  { name: "Todo", data: "10/12", span: "Completed", color: "green" },
  { name: "Notes", data: "10", span: "Notes", color: "yellow" },
];

// Chart drawing area inside the SVG viewBox
const CHART = {
  w: 120,
  h: 50,
  left: 9,
  right: 114,
  top: 9,
  bottom: 38,
  labelY: 46,
};

// "2023-06-14" -> "Jun 14"
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const RightSidePage = () => {
  const [page, setPage] = useState(0); // 0 = latest 7 days, 1 = 7 days before that, ...

  const activityHistory = [
    { date: "2023-06-01", activity: "Completed a task" },
    { date: "2023-06-01", activity: "Added a new note" },
    { date: "2023-06-02", activity: "Updated journal entry" },
    { date: "2023-06-02", activity: "Logged an expense" },
    { date: "2023-06-02", activity: "Completed a task" },
    { date: "2023-06-03", activity: "Added a new note" },
    { date: "2023-06-04", activity: "Updated journal entry" },
    { date: "2023-06-04", activity: "Logged an expense" },
    { date: "2023-06-04", activity: "Completed a task" },
    { date: "2023-06-04", activity: "Added a new note" },
    { date: "2023-06-05", activity: "Updated journal entry" },
    { date: "2023-06-05", activity: "Logged an expense" },
    { date: "2023-06-06", activity: "Completed a task" },
    { date: "2023-06-06", activity: "Added a new note" },
    { date: "2023-06-06", activity: "Updated journal entry" },
    { date: "2023-06-06", activity: "Logged an expense" },
    { date: "2023-06-06", activity: "Completed a task" },
    { date: "2023-06-07", activity: "Added a new note" },
    { date: "2023-06-07", activity: "Updated journal entry" },
    { date: "2023-06-07", activity: "Logged an expense" },
    { date: "2023-06-08", activity: "Completed a task" },
    { date: "2023-06-09", activity: "Added a new note" },
    { date: "2023-06-09", activity: "Updated journal entry" },
    { date: "2023-06-10", activity: "Logged an expense" },
    { date: "2023-06-10", activity: "Completed a task" },
    { date: "2023-06-10", activity: "Added a new note" },
    { date: "2023-06-10", activity: "Updated journal entry" },
    { date: "2023-06-11", activity: "Logged an expense" },
    { date: "2023-06-11", activity: "Completed a task" },
    { date: "2023-06-11", activity: "Added a new note" },
    { date: "2023-06-11", activity: "Updated journal entry" },
    { date: "2023-06-11", activity: "Logged an expense" },
    { date: "2023-06-11", activity: "Completed a task" },
    { date: "2023-06-12", activity: "Added a new note" },
    { date: "2023-06-12", activity: "Updated journal entry" },
    { date: "2023-06-12", activity: "Logged an expense" },
    { date: "2023-06-13", activity: "Completed a task" },
    { date: "2023-06-13", activity: "Added a new note" },
    { date: "2023-06-14", activity: "Updated journal entry" },
    { date: "2023-06-15", activity: "Logged an expense" },
    { date: "2023-06-15", activity: "Completed a task" },
    { date: "2023-06-15", activity: "Added a new note" },
    { date: "2023-06-15", activity: "Updated journal entry" },
    { date: "2023-06-16", activity: "Logged an expense" },
    { date: "2023-06-16", activity: "Completed a task" },
    { date: "2023-06-16", activity: "Added a new note" },
    { date: "2023-06-16", activity: "Updated journal entry" },
    { date: "2023-06-16", activity: "Logged an expense" },
    { date: "2023-06-17", activity: "Completed a task" },
    { date: "2023-06-17", activity: "Added a new note" },
    { date: "2023-06-18", activity: "Updated journal entry" },
    { date: "2023-06-18", activity: "Logged an expense" },
    { date: "2023-06-18", activity: "Completed a task" },
    { date: "2023-06-19", activity: "Added a new note" },
    { date: "2023-06-19", activity: "Updated journal entry" },
    { date: "2023-06-19", activity: "Logged an expense" },
    { date: "2023-06-19", activity: "Completed a task" },
    { date: "2023-06-20", activity: "Added a new note" },
    { date: "2023-06-20", activity: "Updated journal entry" },
  ];

  // Group activities by date
  const activitiesByDate = {};
  activityHistory.forEach(({ date, activity }) => {
    (activitiesByDate[date] ||= []).push(activity);
  });
  const allDays = Object.entries(activitiesByDate).sort(([a], [b]) =>
    a.localeCompare(b),
  ); // oldest -> newest

  // Show 7 days at a time
  const end = allDays.length - page * 7;
  const start = Math.max(end - 7, 0);
  const visibleDays = allDays.slice(start, end);
  const canGoOlder = start > 0;
  const canGoNewer = page > 0;
  const totalActivity = visibleDays.reduce(
    (sum, [, list]) => sum + list.length,
    0,
  );

  // Y scale (with headroom) and gridline ticks
  const yMax = Math.max(...visibleDays.map(([, list]) => list.length)) + 1;
  const tickStep = Math.ceil(yMax / 4);
  const ticks = [];
  for (let v = 0; v <= yMax; v += tickStep) ticks.push(v);
  const yFor = (value) =>
    CHART.bottom - (value / yMax) * (CHART.bottom - CHART.top);

  const lastIndex = Math.max(visibleDays.length - 1, 1);
  const points = visibleDays.map(([date, list], index) => ({
    date,
    total: list.length,
    activities: list,
    x: CHART.left + (index / lastIndex) * (CHART.right - CHART.left),
    y: yFor(list.length),
  }));
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPath = `M ${points[0].x},${CHART.bottom} ${points
    .map(({ x, y }) => `L ${x},${y}`)
    .join(" ")} L ${points[points.length - 1].x},${CHART.bottom} Z`;

  const arrowBtn =
    "p-1.5 rounded-full hover:bg-white/25 active:scale-95 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed";

  return (
    <div className="right w-1/2 h-11/12 bg-white rounded-3xl p-4 flex flex-col justify-around">
      <div className="top h-3/12 flex justify-around items-center">
        {SECTIONS.map((item) => (
          <div
            key={item.name}
            type="button"
            className={`h-28 w-28 bg-[#e3e3e3] hover:bg-[#d4d4d4] hover:-translate-y-0.5 active:scale-95 transition rounded-3xl select-none capitalize text-black flex justify-center items-center  cursor-pointer`}
          >
            {/* .  d4d4d4*/}
            <div className="text-md font-bold w-8/12  h-16 overflow-hidden text-ellipsis text-center flex justify-center items-center flex-col gap-1">
              <div className="">{item.data}</div>
              <div className="w-full text-xs font-light">{item.span}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom w-full h-7/12 bg-[#ececec] rounded-3xl p-4 flex flex-col justify-between text-black">
        {/* Header: range switcher + total */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Show older 7 days"
              disabled={!canGoOlder}
              onClick={() => setPage((p) => p + 1)}
              className={arrowBtn}
            >
              <MoveLeft size={18} />
            </button>
            <span className="text-sm font-medium min-w-36 text-center">
              {formatDate(visibleDays[0][0])} –{" "}
              {formatDate(visibleDays[visibleDays.length - 1][0])}
            </span>
            <button
              type="button"
              aria-label="Show newer 7 days"
              disabled={!canGoNewer}
              onClick={() => setPage((p) => p - 1)}
              className={arrowBtn}
            >
              <MoveRight size={18} />
            </button>
          </div>

          <div className="text-right leading-tight">
            <p className="text-2xl font-bold">{totalActivity}</p>
            <p className="text-xs opacity-80">total activities</p>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          className="w-full h-full"
          role="img"
          aria-label="Activity history graph"
        >
          {/* gridlines + y labels */}
          {ticks.map((value) => (
            <g key={value}>
              <line
                x1={CHART.left}
                x2={CHART.right}
                y1={yFor(value)}
                y2={yFor(value)}
                stroke="#000"
                strokeOpacity={value === 0 ? 0.6 : 0.2}
                strokeWidth="0.25"
                strokeDasharray={value === 0 ? "" : "1 1"}
              />
              <text
                x={CHART.left - 2.5}
                y={yFor(value) + 1}
                textAnchor="end"
                fontSize="2.6"
                fill="#000"
                opacity="0.8"
              >
                {value}
              </text>
            </g>
          ))}

          {/* soft fill under the line */}
          <path d={areaPath} fill="#000" fillOpacity="0.15" />

          <polyline
            fill="none"
            stroke="#000"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {points.map(({ date, total, activities, x, y }) => (
            <g key={date} className="cursor-pointer">
              <circle cx={x} cy={y} r="1.4" fill="#444" />
              {/* bigger invisible hit area; hover shows that day's activities */}
              <circle cx={x} cy={y} r="4" fill="transparent">
                <title>{`${formatDate(date)}: ${activities.join(", ")}`}</title>
              </circle>

              <text
                x={x}
                y={y - 3}
                textAnchor="middle"
                fontSize="3"
                fontWeight="bold"
                fill="#000"
              >
                {total}
              </text>
              <text
                x={x}
                y={CHART.labelY}
                textAnchor="middle"
                fontSize="2.8"
                fill="#000"
              >
                {formatDate(date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default RightSidePage;
