import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, UserRound, IndianRupee, Check, NotebookText, TrendingUp } from "lucide-react";

const SECTIONS = [
  { name: "Entries", data: "12", span: "Entries", tone: "purple", Icon: UserRound },
  { name: "Expenses", data: "₹10000", span: "Expenses", tone: "orange", Icon: IndianRupee },
  { name: "Completed", data: "10/12", span: "Completed", tone: "green", Icon: Check },
  { name: "Notes", data: "10", span: "Notes", tone: "blue", Icon: NotebookText },
];
const CHART = { w: 120, h: 54, left: 9, right: 115, top: 7, bottom: 41, labelY: 50 };
const ACTIVITY = [1, 4, 5, 2, 3, 4, 2];
const formatDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const RightSidePage = () => {
  const [page, setPage] = useState(0);
  const visibleDays = useMemo(() => ACTIVITY.map((total, index) => {
    const date = new Date(Date.UTC(2023, 5, 14 + index - page * 7));
    return { date, total };
  }), [page]);
  const canGoNewer = page > 0;
  const points = visibleDays.map(({ date, total }, index) => {
    const x = CHART.left + (index / Math.max(visibleDays.length - 1, 1)) * (CHART.right - CHART.left);
    const y = CHART.bottom - (total / 6) * (CHART.bottom - CHART.top);
    return { date, total, x, y };
  });
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPath = points.length ? `M ${points[0].x},${CHART.bottom} ${points.map(({ x, y }) => `L ${x},${y}`).join(" ")} L ${points[points.length - 1].x},${CHART.bottom} Z` : "";
  const totalCount = visibleDays.reduce((sum, day) => sum + day.total, 0);
  const rangeLabel = visibleDays.length ? `${formatDate(visibleDays[0].date)} – ${formatDate(visibleDays[visibleDays.length - 1].date)}` : "No activity";

  return (
    <section className="dashboard-right" aria-label="Activity overview">
      <div className="stats-grid">
        {SECTIONS.map(({ name, data, span, tone, Icon }) => (
          <article className={`stat-card ${tone}`} key={name}>
            <div className="stat-icon"><Icon size={22} strokeWidth={2.2} /></div>
            <strong className="stat-value">{data}</strong>
            <span className="stat-label">{span}</span>
          </article>
        ))}
      </div>

      <article className="glass-card card-hover chart-card">
        <div className="chart-head">
          <div className="chart-range">
            <span className="stat-icon" style={{ width: 43, height: 43, margin: 0, color: "#8139db", background: "#eadbff" }}><TrendingUp size={21} /></span>
            <button type="button" className="round-icon-btn" aria-label="Previous week" onClick={() => setPage((p) => p + 1)}><ChevronLeft size={18} /></button>
            <span>{rangeLabel}</span>
            <button type="button" className="round-icon-btn" aria-label="Next week" disabled={!canGoNewer} onClick={() => setPage((p) => Math.max(0, p - 1))}><ChevronRight size={18} /></button>
          </div>
          <div className="chart-total"><strong>{totalCount}</strong><span>total activities</span></div>
        </div>

        <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} className="activity-chart" role="img" aria-label="Activity chart for the selected week">
          <defs>
            <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a96af2" stopOpacity=".38" /><stop offset="100%" stopColor="#d9baff" stopOpacity=".06" /></linearGradient>
          </defs>
          {[0, 2, 4, 6].map((value) => {
            const y = CHART.bottom - (value / 6) * (CHART.bottom - CHART.top);
            return <g key={value}><line className="chart-grid" x1={CHART.left} x2={CHART.right} y1={y} y2={y} /><text className="chart-label" x="3" y={y + 1}>{value}</text></g>;
          })}
          {points.length > 0 && <path d={areaPath} fill="url(#activityFill)" />}
          {points.length > 1 && <polyline className="chart-line" points={linePoints} />}
          {points.map(({ date, total, x, y }, index) => (
            <g key={date.toISOString()}>
              <circle className="chart-dot" style={{ animationDelay: `${index * 90}ms` }} cx={x} cy={y} r="1.45" />
              <text className="chart-label" x={x} y={y - 3} textAnchor="middle" style={{ fontWeight: 700 }}>{total}</text>
              <text className="chart-label" x={x} y={CHART.labelY} textAnchor="middle">{formatDate(date)}</text>
            </g>
          ))}
        </svg>
      </article>
    </section>
  );
};

export default RightSidePage;
