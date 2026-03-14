// src/components/charts/Charts.jsx
import { C } from "../../styles/tokens";
import { BAR_DATA, CAT_CFG } from "../../data/constants";

/* ── Monthly Bar Chart ──────────────────────────────────── */
export function BarChart({ currentTotal = 2839 }) {
  const data = [...BAR_DATA.slice(0, 5), { m: "Mar", v: currentTotal }];
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

/* ── Category Progress Bars ─────────────────────────────── */
export function CategoryBars({ expenses = [] }) {
  const total = expenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(CAT_CFG)
        .filter(([k]) => k !== "Other" && k !== "Income")
        .map(([cat, { color }]) => {
          const amt = expenses
            .filter((e) => e.cat === cat && e.amount < 0)
            .reduce((s, e) => s + Math.abs(e.amount), 0);
          const pct = total > 0 ? (amt / total) * 100 : 0;
          if (!amt) return null;
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
