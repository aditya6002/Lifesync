// src/modules/dashboard/DashboardPage.jsx
import { C, FONTS } from "../../styles/tokens";
import { Glass, Btn } from "../../components/ui/Atoms";

export default function DashboardPage({ setActive }) {
  const stats = [
    {
      label: "Spent This Month",
      value: "₹2,839",
      icon: "◈",
      color: C.violet,
      sub: "↑12% vs Feb",
      sec: "expenses",
    },
    {
      label: "Journal Streak",
      value: "7 days 🔥",
      icon: "✦",
      color: C.yellow,
      sub: "Keep it up!",
      sec: "journal",
    },
    {
      label: "Pending Tasks",
      value: "4",
      icon: "◎",
      color: C.red,
      sub: "2 due today",
      sec: "tasks",
    },
    {
      label: "Total Notes",
      value: "4",
      icon: "◇",
      color: C.blue,
      sub: "Updated today",
      sec: "notes",
    },
  ];

  const activity = [
    {
      icon: "🍜",
      text: "Added: Zomato ₹340",
      time: "10 min ago",
      sec: "expenses",
    },
    { icon: "✦", text: "Wrote journal entry", time: "1h ago", sec: "journal" },
    {
      icon: "✅",
      text: 'Completed "Read DBMS Ch.7"',
      time: "2h ago",
      sec: "tasks",
    },
    { icon: "◇", text: "Updated: Project Ideas", time: "3h ago", sec: "notes" },
  ];

  const insights = [
    {
      text: "You spent ₹1,200 on food — 40% more than February.",
      color: C.orange,
    },
    {
      text: "Mood positive for 4 days straight! Great streak.",
      color: C.green,
    },
    {
      text: "3 high-priority tasks pending. Tackle before noon.",
      color: C.red,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Welcome banner */}
      <Glass
        style={{
          padding: 24,
          background:
            "linear-gradient(135deg,rgba(124,58,237,.18),rgba(14,165,233,.07))",
          border: "1px solid rgba(124,58,237,.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 26,
                color: C.text,
                fontWeight: 700,
              }}
            >
              Good morning, Arjun ✨
            </div>
            <div style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>
              Wednesday, 11 March 2026
            </div>
            <div
              style={{
                marginTop: 10,
                color: "#c4b5fd",
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              "Small steps every day compound into extraordinary results."
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textDim }}>Today's score</div>
            <div
              style={{
                fontSize: 38,
                fontFamily: FONTS.display,
                color: C.violet,
                lineHeight: 1,
              }}
            >
              82%
            </div>
            <div style={{ fontSize: 11, color: C.textMid }}>productivity</div>
          </div>
        </div>
      </Glass>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(178px,1fr))",
          gap: 12,
        }}
      >
        {stats.map((s, i) => (
          <Glass
            key={i}
            className="hov-card"
            onClick={() => setActive(s.sec)}
            style={{ padding: 18, cursor: "pointer", transition: "all .2s" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  color: C.textDim,
                  background: "rgba(255,255,255,.05)",
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {s.sub}
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 22,
                fontWeight: 700,
                color: C.text,
                fontFamily: FONTS.display,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
              {s.label}
            </div>
          </Glass>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* AI Insights */}
        <Glass style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 16, color: "#c4b5fd" }}>⟡</span>
            <span
              style={{ fontFamily: FONTS.display, fontSize: 15, color: C.text }}
            >
              AI Insights
            </span>
          </div>
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 3,
                  minHeight: 34,
                  borderRadius: 4,
                  background: ins.color,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {ins.text}
              </p>
            </div>
          ))}
          <Btn
            variant="ai"
            style={{ width: "100%", marginTop: 4 }}
            onClick={() => setActive("ai")}
          >
            Ask AI Assistant →
          </Btn>
        </Glass>

        {/* Recent Activity */}
        <Glass style={{ padding: 20 }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 15,
              color: C.text,
              marginBottom: 14,
            }}
          >
            Recent Activity
          </div>
          {activity.map((a, i) => (
            <div
              key={i}
              onClick={() => setActive(a.sec)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 11,
                cursor: "pointer",
                padding: "5px 7px",
                borderRadius: 8,
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: 17, width: 26, textAlign: "center" }}>
                {a.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#cbd5e1" }}>{a.text}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{a.time}</div>
              </div>
              <span style={{ fontSize: 12, color: C.textDim }}>→</span>
            </div>
          ))}
        </Glass>
      </div>
    </div>
  );
}
