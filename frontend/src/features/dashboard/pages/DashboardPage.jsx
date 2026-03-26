import { useNavigate } from "react-router-dom";
import { C, FONTS } from "../../../shared/styles/tokens";
import { Glass, Btn } from "../../../shared/components/ui/Atoms";
import { timeAgo } from "../../../shared/utils/helpers";
import { use, useEffect, useState } from "react";
import dashboardApi from "../dashboard.route";

const MODULE_ICONS = {
  expenses: "🍜",
  journal: "✦",
  notes: "◇",
  tasks: "✅",
  ai: "⟡",
};

export default function DashboardPage() {
  const nav = useNavigate();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [streak, setStreak] = useState(0);

  const [pending, setPending] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);

  const [pct, setPct] = useState(0);

  const [notes, setNotes] = useState([]);
  const [dailyScore, setDailyScore] = useState({ score: 0, breakdown: {} });
  const [aiInsights, setAiInsights] = useState([]);
  const [score, setScore] = useState(0);
  // const score = dailyScore?.score ?? 82;
  const quote = [
    "Small steps every day compound into extraordinary results.",
    "Consistency beats intensity when intensity doesn’t last.",
    "Tiny improvements today create massive results tomorrow.",
    "Progress is built one focused day at a time.",
    "Big wins are just small wins repeated.",
    "Discipline today becomes freedom tomorrow.",
    "Show up daily, even when it’s boring—that’s where growth lives.",
    "Success isn’t sudden; it’s stacked.",
    "Do a little better than yesterday—that’s enough.",
    "Momentum starts with one step, then another.",
    "You don’t need perfect—just persistent.",
    "Small habits shape big futures.",
    "Every action is a vote for the person you’re becoming.",
    "Stay consistent long enough and results become inevitable.",
    "Effort compounds just like interest.",
    "Win the day, and you’ll win the year.",
    "The gap between goals and reality is filled with daily action.",
    "Keep going—slow progress is still progress.",
    "Focus on the system, and results will follow.",
    "One percent better every day changes everything.",
    "Little by little, a little becomes a lot.",
    "Daily actions decide your destiny.",
    "Success grows in the routine you repeat.",
    "Start small, stay steady, finish strong.",
    "Consistency turns effort into excellence.",
    "The secret is showing up, again and again.",
    "What feels small today builds strength for tomorrow.",
    "Your future is created by what you do today.",
    "Keep stacking days that matter.",
    "The grind you avoid is the life you delay.",
    "Small progress is still a big deal.",
    "Habits are the blueprint of your life.",
    "Action cures overthinking.",
    "Don’t rush—build it right, brick by brick.",
    "Stay patient, stay consistent, stay winning.",
    "Each step forward counts, no matter how small.",
    "Growth is quiet, but results are loud.",
    "The magic is in the mundane.",
    "Push a little more than yesterday.",
    "You get better by doing, not waiting.",
    "Repetition builds mastery.",
    "Dream big, act daily.",
    "Slow work beats no work.",
    "Your habits decide your height.",
    "Consistency creates confidence.",
  ];

  const stats = [
    {
      label: "Spent This Month",
      value: `₹${total.toLocaleString()}`,
      icon: "◈",
      color: C.violet,
      sub: "this month",
      path: "/expenses",
    },
    {
      label: "Journal Streak",
      value: `${streak} days 🔥`,
      icon: "✦",
      color: C.yellow,
      sub: "Keep it up",
      path: "/journal",
    },
    {
      label: "Pending Tasks",
      value: String(pending),
      icon: "◎",
      color: C.red,
      sub: "outstanding",
      path: "/tasks",
    },
    {
      label: "Total Notes",
      value: String(notes),
      icon: "◇",
      color: C.blue,
      sub: "all time",
      path: "/notes",
    },
  ];

  useEffect(() => {
    async function getAndSetDashboardData() {
      try {
        const data = await dashboardApi.getAllData();
        const dt = data.data.data;

        setAiInsights(dt.aiInsights);
        setStreak(dt.journalStreak);
        setTotal(dt.currentMonthExpTotal);
        setRecentLogs(dt.recentActivity);
        setPending(dt.todayPendingTasks);
        setPct(dt.productivityScore);
        setNotes(dt.totalNotes);
        setScore(dt.todayTaskScore);
        setDailyScore(dt.monthlyJournalCount);
      } catch (error) {
        console.log(error);
        const errMsg = error?.message || "Failed to fetch dashboard data";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }

    getAndSetDashboardData();
  }, []);

  if (loading) {
    return (
      <h1
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </h1>
    );
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div
      className="screen-in"
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
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
              Good morning ✨
            </div>
            <div style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div
              style={{
                marginTop: 10,
                color: "#c4b5fd",
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              {quote[Math.floor(Math.random() * quote.length)]}
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
              {score}%
            </div>
            <div style={{ fontSize: 11, color: C.textMid }}>productivity</div>
          </div>
        </div>
        {/* Progress bar */}
        <div
          style={{
            marginTop: 16,
            height: 5,
            background: "rgba(255,255,255,.07)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: `linear-gradient(90deg,${C.violet},${C.violetLight})`,
              borderRadius: 4,
              transition: "width .5s",
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 5 }}>
          Task completion: {pct}%
        </div>
      </Glass>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", //178
          gap: 12,
        }}
      >
        {stats.map((s, i) => (
          <Glass
            key={i}
            className="hov-card"
            onClick={() => nav(s.path)}
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
          {dailyScore?.breakdown
            ? Object.entries(dailyScore.breakdown).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 32,
                      borderRadius: 4,
                      background: C.violet,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.textDim,
                        textTransform: "capitalize",
                      }}
                    >
                      {key} score
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "rgba(255,255,255,.06)",
                        borderRadius: 4,
                        overflow: "hidden",
                        marginTop: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${val.score}%`,
                          height: "100%",
                          background: C.violet,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: C.textMid }}>
                    {val.score}%
                  </span>
                </div>
              ))
            : aiInsights.map((ins, i) => (
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
            onClick={() => nav("/ai")}
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
          {recentLogs.length === 0 ? (
            <div
              style={{
                fontSize: 13,
                color: C.textDim,
                textAlign: "center",
                padding: 20,
                height: "92%",
              }}
            >
              <p
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                No activity yet. Start using the app
              </p>
            </div>
          ) : (
            recentLogs.slice(0, 5).map((a, i) => (
              <div
                key={i}
                onClick={() => nav(`/${a.module}`)}
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
                  {MODULE_ICONS[a.module] ?? "●"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#cbd5e1",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.entityName ?? a.module}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim }}>
                    {timeAgo(a.createdAt)}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: C.textDim }}>→</span>
              </div>
            ))
          )}
        </Glass>
      </div>
    </div>
  );
}
