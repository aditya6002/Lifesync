import { C } from "../../styles/tokens";

const CAT_COLORS = {
  Food: "#f97316",
  Travel: "#3b82f6",
  Study: "#a855f7",
  Health: "#ec4899",
  Entertainment: "#6366f1",
  Shopping: "#06b6d4",
  Income: "#22c55e",
  Other: "#475569",
};

// ── Monthly Bar Chart ─────────────────────────────────────

export function BarChart({ currentTotal = 2839 }) {
  const data = [
    { m: "Apr", v: 2400 },
    { m: "May", v: 1398 },
    { m: "Jun", v: 3800 },
    { m: "Jul", v: 4300 },
    { m: "Aug", v: 3490 },
    { m: "Sep", v: 2839 },
    { m: "Oct", v: 3200 },
    { m: "Nov", v: 4100 },
    { m: "Dec", v: 5800 },
    { m: "Jan", v: 3600 },
    { m: "Feb", v: 4700 },
    { m: "Mar", v: currentTotal },
  ];
  const max = Math.max(...data.map((d) => d.v), 1);

  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: Math.max(4, (d.v / max) * 84),
              background:
                i === 5
                  ? `linear-gradient(180deg,${C.violet},${C.violetLight})`
                  : "rgba(124,58,237,.2)",
              borderRadius: "5px 5px 0 0",
              border:
                i === 5
                  ? `1px solid ${C.violetLight}`
                  : "1px solid rgba(124,58,237,.15)",
              transition: "height .5s ease",
            }}
          />
          <span style={{ fontSize: 9, color: C.textDim }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
}

// ── Category Progress Bars ────────────────────────────────

export function CategoryBars({ expenses }) {
  const total = expenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);

  const cats = Object.entries(CAT_COLORS).filter(
    ([k]) => k !== "Other" && k !== "Income",
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {cats.map(([cat, color]) => {
        const amt = expenses
          .filter((e) => e.cat === cat && e.amount < 0)
          .reduce((s, e) => s + Math.abs(e.amount), 0);
        if (!amt) return null;
        const pct = total > 0 ? (amt / total) * 100 : 0;
        return (
          <div
            key={cat}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ width: 54, fontSize: 11, color: C.textMid }}>
              {cat}
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                background: "rgba(255,255,255,.06)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: color,
                  borderRadius: 4,
                  transition: "width .6s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: C.textMid,
                width: 46,
                textAlign: "right",
              }}
            >
              ₹{amt}
            </span>
          </div>
        );
      })}
    </div>
  );
}
