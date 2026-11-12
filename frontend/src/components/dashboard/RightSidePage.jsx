const RightSidePage = () => {
  const activityHistory = [
    { date: "2023-06-01", activity: "Completed a task" },
    { date: "2023-06-02", activity: "Added a new note" },
    { date: "2023-06-03", activity: "Updated journal entry" },
    { date: "2023-06-04", activity: "Logged an expense" },
    { date: "2023-06-05", activity: "Completed a task" },
    { date: "2023-06-06", activity: "Added a new note" },
    { date: "2023-06-07", activity: "Updated journal entry" },
    { date: "2023-06-08", activity: "Logged an expense" },
    { date: "2023-06-09", activity: "Completed a task" },
    { date: "2023-06-10", activity: "Added a new note" },
    { date: "2023-06-11", activity: "Updated journal entry" },
    { date: "2023-06-12", activity: "Logged an expense" },
    { date: "2023-06-13", activity: "Completed a task" },
    { date: "2023-06-14", activity: "Added a new note" },
    { date: "2023-06-15", activity: "Updated journal entry" },
    { date: "2023-06-16", activity: "Logged an expense" },
    { date: "2023-06-17", activity: "Completed a task" },
    { date: "2023-06-18", activity: "Added a new note" },
    { date: "2023-06-19", activity: "Updated journal entry" },
    { date: "2023-06-20", activity: "Logged an expense" },
  ];

  // Total activities per day (one number per date, not every entry)
  const totalsByDate = {};
  activityHistory.forEach(({ date }) => {
    totalsByDate[date] = (totalsByDate[date] || 0) + 1;
  });
  const dailyTotals = Object.entries(totalsByDate); // [[date, total], ...]
  const totalActivity = activityHistory.length;

  // Calculate x/y once and reuse for both the line and the dots
  const lastIndex = Math.max(dailyTotals.length - 1, 1); // avoids divide-by-zero
  const yMax = Math.max(...dailyTotals.map(([, total]) => total)) + 1; // headroom
  const points = dailyTotals.map(([date, total], index) => ({
    date,
    x: 4 + (index / lastIndex) * 92,
    y: 40 - (total / yMax) * 32,
  }));
  const graphPoints = points.map(({ x, y }) => `${x},${y}`).join(" ");

  // Only label some dates so they don't overlap when there are many points
  const labelStep = Math.ceil(points.length / 6);
  const showLabel = (index) =>
    index % labelStep === 0 || index === points.length - 1;

  return (
    <div className="right w-1/2 h-11/12 bg-white rounded-3xl p-4 flex flex-col justify-around">
      <div className="top h-3/12 flex justify-around items-center">
        {["todo", "journal", "expenses", "notes"].map((item, index) => {
          return (
            <div
              key={index}
              className="h-24 w-24 bg-[#e3e3e3] rounded-3xl flex justify-center items-center select-none"
            >
              <h1>{item}</h1>
            </div>
          );
        })}
      </div>
      <div className="bottom w-full h-7/12 bg-sky-500 rounded-3xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-white text-sm font-medium">
          <span>Activity graph</span>
          <span>{totalActivity} total activities</span>
        </div>

        <svg
          viewBox="0 0 100 55"
          className="w-full h-full"
          role="img"
          aria-label="Activity history graph"
        >
          <polyline
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={graphPoints}
          />

          {points.map(({ date, x, y }, index) => (
            <g key={date}>
              <circle cx={x} cy={y} r="1.6" fill="#ffffff" />
              {showLabel(index) && (
                <text
                  x={x}
                  y="52"
                  textAnchor="middle"
                  fontSize="3.2"
                  fill="#eaf7ff"
                >
                  {date.slice(5)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default RightSidePage;
