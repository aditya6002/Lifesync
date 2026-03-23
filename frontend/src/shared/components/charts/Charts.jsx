import { useMemo } from "react";
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

// export function BarChart({ currentTotal = 2839, date }) {
//   console.log(date);

//   const data = [
//     { m: "Apr", v: 2400 },
//     { m: "May", v: 1398 },
//     { m: "Jun", v: 3800 },
//     { m: "Jul", v: 4300 },
//     { m: "Aug", v: 3490 },
//     { m: "Sep", v: 2839 },
//     { m: "Oct", v: 3200 },
//     { m: "Nov", v: 4100 },
//     { m: "Dec", v: 5800 },
//     { m: "Jan", v: 3600 },
//     { m: "Feb", v: 4700 },
//     { m: "Mar", v: currentTotal },
//   ];
//   const max = Math.max(...data.map((d) => d.v), 1);
//   const currDate = new Date()
//   return (
//     <div
//       style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}
//     >
//       {data.map((d, i) => (
//         <div
//           key={i}
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: 4,
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               height: Math.max(4, (d.v / max) * 84),
//               background:
//                 d.createdAt === currDate
//                   ? `linear-gradient(180deg,${C.violet},${C.violetLight})`
//                   : "rgba(124,58,237,.2)",
//               borderRadius: "5px 5px 0 0",
//               border:
//                 d.createdAt === date
//                   ? `1px solid ${C.violetLight}`
//                   : "1px solid rgba(124,58,237,.15)",
//               transition: "height .5s ease",
//             }}
//           />
//           <span style={{ fontSize: 9, color: C.textDim }}>
//             {d.m}
//             {d.v}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

export function BarChart({ currentTotal = 0, date, expenses = [] }) {
  const monthTotals = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      if (e.amount >= 0) return;
      const key = e.date.slice(0, 7);
      map[key] = (map[key] ?? 0) + Math.abs(e.amount);
    });
    return map;
  }, [expenses]);

  const allKeys = useMemo(() => {
    const keys = new Set(Object.keys(monthTotals));
    keys.add(date);
    return [...keys].sort();
  }, [monthTotals, date]);

  const windowKeys = useMemo(() => {
    if (allKeys.length <= 10) return allKeys; // ✅ sab dikhao jab tak 10 se kam

    const activeIdx = allKeys.indexOf(date);
    const sliceStart = Math.max(
      0,
      Math.min(activeIdx - 5, allKeys.length - 10),
    );
    return allKeys.slice(sliceStart, sliceStart + 10);
  }, [allKeys, date]);

  const windowData = windowKeys.map((key) => ({
    m: new Date(`${key}-01`).toLocaleDateString("en-IN", { month: "short" }),
    v: key === date ? currentTotal : (monthTotals[key] ?? 0),
    isActive: key === date,
  }));

  const max = Math.max(...windowData.map((d) => d.v), 1);

  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}
    >
      {windowData.map((d, i) => (
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
              background: d.isActive
                ? `linear-gradient(180deg,${C.violet},${C.violetLight})`
                : "rgba(124,58,237,.2)",
              borderRadius: "5px 5px 0 0",
              border: d.isActive
                ? `1px solid ${C.violetLight}`
                : "1px solid rgba(124,58,237,.15)",
              transition: "height .5s ease",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: d.isActive ? C.violet : C.textDim,
              fontWeight: d.isActive ? 700 : 400,
            }}
          >
            {d.m}
          </span>
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
            style={{ display: "flex", alignItems: "center", gap: 20 }} //gap - 12
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
