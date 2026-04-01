// src/features/profile/pages/ProfilePage.tsx
import { useState, useMemo } from "react";
import { C, FONTS } from "../shared/styles/tokens";
import {
  Glass,
  Btn,
  FInput,
  FTextarea,
  FSelect,
  Toggle,
  InlineLoader,
} from "../shared/components/ui/Atoms";
import { Modal } from "../shared/components/ui/Modal";

// ── helpers ───────────────────────────────────────────────
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const HEATMAP_COLS = [
  "rgba(255,255,255,0.05)",
  "rgba(124,58,237,0.2)",
  "rgba(124,58,237,0.42)",
  "rgba(124,58,237,0.65)",
  "rgba(124,58,237,0.88)",
];

// ── demo data ─────────────────────────────────────────────
const DEMO_EXPENSES_THIS_MONTH = {
  Food: 1200,
  Travel: 380,
  Study: 299,
  Health: 800,
  Entertainment: 280,
  Shopping: 0,
};

const HEATMAP = Array.from({ length: 70 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (69 - i));
  const lvl = Math.random() > 0.38 ? Math.floor(Math.random() * 4) + 1 : 0;
  return {
    i,
    lvl,
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    label:
      lvl === 0
        ? "No activity"
        : `${lvl} action${lvl > 1 ? "s" : ""} — ${["expenses", "journal", "notes", "tasks", "ai"][Math.floor(Math.random() * 5)]}`,
  };
});

const RECENT = [
  {
    icon: "🍜",
    text: "Added expense: Zomato ₹340",
    time: "10 min ago",
    color: C.orange,
  },
  {
    icon: "✦",
    text: "Wrote journal entry — Happy mood",
    time: "1h ago",
    color: C.yellow,
  },
  {
    icon: "✅",
    text: 'Completed "Read DBMS Chapter 7"',
    time: "2h ago",
    color: C.green,
  },
  {
    icon: "◇",
    text: "Updated note: Project Ideas 2025",
    time: "3h ago",
    color: C.blue,
  },
  {
    icon: "⟡",
    text: "AI generated weekly expense summary",
    time: "Yesterday",
    color: "#c4b5fd",
  },
  {
    icon: "◈",
    text: "Added income: Pocket Money ₹3,000",
    time: "Yesterday",
    color: C.violet,
  },
];

const ACHIEVEMENTS = [
  {
    icon: "🔥",
    title: "7-Day Streak",
    desc: "Journaled 7 days in a row",
    earned: true,
  },
  {
    icon: "💰",
    title: "Budget Master",
    desc: "Stayed under budget for a month",
    earned: true,
  },
  {
    icon: "✅",
    title: "Task Crusher",
    desc: "Completed 30+ tasks in a month",
    earned: true,
  },
  {
    icon: "📚",
    title: "Knowledge Keeper",
    desc: "Created 20+ notes",
    earned: true,
  },
  {
    icon: "🌟",
    title: "30-Day Streak",
    desc: "Journal 30 days consecutively",
    earned: false,
  },
  {
    icon: "🎯",
    title: "Goal Achiever",
    desc: "Complete all tasks in a week",
    earned: false,
  },
  {
    icon: "🧘",
    title: "Zen Master",
    desc: "Log positive mood for 14 days",
    earned: false,
  },
  {
    icon: "💎",
    title: "Power User",
    desc: "Use all 5 modules in one day",
    earned: false,
  },
];

// ── Category budget config ─────────────────────────────────
const BUDGET_CATS = [
  { key: "Food", icon: "🍜", color: "#f97316", label: "Food & Dining" },
  { key: "Travel", icon: "🚇", color: "#3b82f6", label: "Travel & Transport" },
  { key: "Study", icon: "📚", color: "#a855f7", label: "Study & Education" },
  { key: "Health", icon: "🏋️", color: "#ec4899", label: "Health & Fitness" },
  {
    key: "Entertainment",
    icon: "🎬",
    color: "#6366f1",
    label: "Entertainment",
  },
  { key: "Shopping", icon: "🛍️", color: "#06b6d4", label: "Shopping" },
  { key: "Other", icon: "📦", color: "#475569", label: "Other" },
];

const DEFAULT_BUDGET = {
  monthly: 5000,
  categories: {
    Food: 1500,
    Travel: 600,
    Study: 800,
    Health: 500,
    Entertainment: 400,
    Shopping: 300,
    Other: 200,
  },
  alerts: true,
  alertPct: 80,
  rollover: false,
};

// ── Small helpers ─────────────────────────────────────────
function SecLabel({ children }) {
  return (
    <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function SettingRow({ icon, label, sub, right, onClick, last }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 0",
        borderBottom: last ? "none" : `1px solid ${C.glassBorder}`,
        cursor: onClick ? "pointer" : "default",
        transition: "opacity .15s",
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.opacity = ".72";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.opacity = "1";
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "rgba(255,255,255,.04)",
          border: `1px solid ${C.glassBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      {right}
      {onClick && <span style={{ fontSize: 14, color: C.textDim }}>→</span>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export default function ProfilePage() {
  const [tab, setTab] = useState("overview");

  // Profile form
  const [form, setForm] = useState({
    name: "Aditya Prakash",
    email: "adityaofficial690@gmail.com",
    phone: "9525321999",
    bio: "B.Tech CSE · IIT Delhi · Love building things and tracking habits.",
    location: "Bihar, India",
    college: "IIT Delhi",
    year: "3rd Year",
    goal: "Crack Google SWE by June 2026",
    profilePictureUrl: "./github.jpg",
  });
  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Budget state
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [budgetSaving, setBudgetSaving] = useState(false);
  const sb = (k, v) => setBudget((p) => ({ ...p, [k]: v }));
  const setCatBudget = (cat, val) =>
    setBudget((p) => ({ ...p, categories: { ...p.categories, [cat]: val } }));

  // Total of all categories
  const catTotal = Object.values(budget.categories).reduce((s, v) => s + v, 0);
  const catOverflow = catTotal > budget.monthly;

  // Modals
  const [editModal, setEditModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [budgetModal, setBudgetModal] = useState(false);
  const [delModal, setDelModal] = useState(false);

  // Password
  const [pf, setPf] = useState({ cur: "", nxt: "", cfm: "" });

  // Notifications
  const [notifs, setNotifs] = useState({
    dailyJournal: true,
    budgetAlert: true,
    weeklyReport: true,
    moodCheckin: false,
    taskDeadline: true,
    aiInsights: true,
  });
  const toggleNotif = (k) => setNotifs((n) => ({ ...n, [k]: !n[k] }));

  // Heatmap tooltip
  const [tooltip, setTooltip] = useState(null);

  const saveProfile = () => {
    setEditModal(false);
  };
  const savePass = () => {
    if (!pf.cur || !pf.nxt || pf.nxt !== pf.cfm) return;
    setPassModal(false);
    setPf({ cur: "", nxt: "", cfm: "" });
  };
  const saveBudget = async () => {
    setBudgetSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setBudgetSaving(false);
    setBudgetModal(false);
  };

  const TABS = ["overview", "activity", "budget", "settings"];

  // Score breakdown
  const scoreBreakdown = [
    { label: "Tasks completed today", score: 50, weight: "40%", color: C.red },
    { label: "Journal written", score: 100, weight: "25%", color: C.yellow },
    { label: "Budget on track", score: 100, weight: "20%", color: C.violet },
    { label: "Notes updated", score: 100, weight: "15%", color: C.blue },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* ── PAGE HEADER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, color: C.text }}>
          Profile
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setEditModal(true)}>✏️ Edit Profile</Btn>
          <Btn variant="ghost" onClick={() => setPassModal(true)}>
            🔒 Password
          </Btn>
        </div>
      </div>

      {/* ── HERO CARD ── */}
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
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: "#fff",
                fontWeight: 700,
                fontFamily: FONTS.display,
                boxShadow: "0 8px 28px rgba(124,58,237,.35)",
                overflow: "hidden",
              }}
            >
              {form.profilePictureUrl == null ? (
                initials(form.name)
              ) : (
                <div
                  style={{
                    backgroundColor: "white",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <img
                    src={form.profilePictureUrl}
                    style={{
                      height: "100%",
                      width: "100%",
                      backgroundImage: "cover",
                    }}
                  />
                </div>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -3,
                right: -3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: C.green,
                border: `2.5px solid ${C.bg}`,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 22,
                color: C.text,
                fontWeight: 700,
              }}
            >
              {form.name}
            </div>
            <div style={{ fontSize: 13, color: C.textMid, marginTop: 3 }}>
              {form.email}
            </div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 5 }}>
              {form.college} · {form.year} · {form.location}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#c4b5fd",
                marginTop: 8,
                fontStyle: "italic",
              }}
            >
              "{form.bio}"
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(124,58,237,.15)",
                border: "1px solid rgba(124,58,237,.3)",
                fontSize: 11,
                color: "#c4b5fd",
              }}
            >
              🎯 {form.goal}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginTop: 20,
            paddingTop: 18,
            borderTop: `1px solid ${C.glassBorder}`,
          }}
        >
          {[
            { label: "Spent", value: "₹2,839", icon: "◈", color: C.violet },
            { label: "Streak", value: "7 days 🔥", icon: "✦", color: C.yellow },
            { label: "Tasks", value: "34", icon: "◎", color: C.green },
            { label: "Notes", value: "24", icon: "◇", color: C.blue },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, color: s.color }}>{s.icon}</div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 18,
                  color: C.text,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Glass>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: 6 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 18px",
              borderRadius: 20,
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 500,
              background: tab === t ? C.violet : "rgba(255,255,255,.05)",
              border: tab === t ? "none" : `1px solid ${C.glassBorder}`,
              color: tab === t ? "#fff" : C.textMid,
              transition: "all .15s",
              textTransform: "capitalize",
              fontFamily: FONTS.body,
            }}
          >
            {t === "budget"
              ? "💰 Budget"
              : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          TAB
      ══════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {/* Productivity score */}
            <Glass style={{ padding: 20 }}>
              <SecLabel>Productivity Score</SecLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg
                  width={90}
                  height={90}
                  viewBox="0 0 90 90"
                  style={{ flexShrink: 0 }}
                >
                  <circle
                    cx={45}
                    cy={45}
                    r={36}
                    fill="none"
                    stroke="rgba(255,255,255,.06)"
                    strokeWidth={9}
                  />
                  <circle
                    cx={45}
                    cy={45}
                    r={36}
                    fill="none"
                    stroke="url(#pg)"
                    strokeWidth={9}
                    strokeDasharray={`${0.82 * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
                    strokeDashoffset={2 * Math.PI * 36 * 0.25}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={C.violet} />
                      <stop offset="100%" stopColor={C.violetLight} />
                    </linearGradient>
                  </defs>
                  <text
                    x={45}
                    y={41}
                    textAnchor="middle"
                    fill={C.text}
                    fontSize={17}
                    fontWeight="700"
                    fontFamily={FONTS.display}
                  >
                    82%
                  </text>
                  <text
                    x={45}
                    y={55}
                    textAnchor="middle"
                    fill={C.textDim}
                    fontSize={9}
                  >
                    today
                  </text>
                </svg>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {scoreBreakdown.map((item, i) => (
                    <div key={i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ fontSize: 10, color: C.textDim }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: 10, color: C.textDim }}>
                          {item.weight}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "rgba(255,255,255,.06)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${item.score}%`,
                            height: "100%",
                            background: item.color,
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Glass>
            {/* AI insight */}
            <Glass
              style={{
                padding: 20,
                background: "rgba(124,58,237,.1)",
                border: "1px solid rgba(124,58,237,.25)",
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>⟡</span>
                <div>
                  <div
                    style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}
                  >
                    AI Profile Insight
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMid,
                      marginTop: 4,
                      lineHeight: 1.65,
                    }}
                  >
                    You've been most productive on Tuesdays. Mood positively
                    correlates with gym days. Journal streak is your strongest
                    habit
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {["View patterns", "Set new goal", "Weekly report"].map(
                      (x, i) => (
                        <Btn key={i} variant="ai" small>
                          {x}
                        </Btn>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Glass>
          </div>
          {/* Achievements */}
          <Glass style={{ padding: 20 }}>
            <SecLabel>Achievements</SecLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(188px,1fr))",
                gap: 10,
              }}
            >
              {ACHIEVEMENTS.map((a, i) => (
                <div
                  key={i}
                  className="hov-card"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: a.earned
                      ? "rgba(124,58,237,.1)"
                      : "rgba(255,255,255,.02)",
                    border: a.earned
                      ? "1px solid rgba(124,58,237,.28)"
                      : `1px solid ${C.glassBorder}`,
                    opacity: a.earned ? 1 : 0.5,
                    transition: "all .2s",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: a.earned ? C.text : C.textMid,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}
                  >
                    {a.desc}
                  </div>
                  {a.earned && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "#c4b5fd",
                        marginTop: 7,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Earned
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Glass>
          {/* Heatmap */}
          <Glass style={{ padding: 20 }}>
            <SecLabel>Activity — Last 70 Days</SecLabel>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {HEATMAP.map((d) => (
                <div
                  key={d.i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: HEATMAP_COLS[d.lvl],
                    cursor: "pointer",
                    transition: "transform .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.4)";
                    setTooltip(d);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    setTooltip(null);
                  }}
                  onClick={() => setTooltip((p) => (p?.i === d.i ? null : d))}
                />
              ))}
            </div>
            {tooltip && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(124,58,237,.15)",
                  border: "1px solid rgba(124,58,237,.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  animation: "fadeIn .15s ease",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: HEATMAP_COLS[tooltip.lvl],
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: "#c4b5fd",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {tooltip.date}
                </div>
                <div style={{ fontSize: 12, color: C.textMid }}>
                  {tooltip.label}
                </div>
                <button
                  onClick={() => setTooltip(null)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    color: C.textDim,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 10,
              }}
            >
              <span style={{ fontSize: 10, color: C.textDim }}>Less</span>
              {HEATMAP_COLS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    background: c,
                  }}
                />
              ))}
              <span style={{ fontSize: 10, color: C.textDim }}>
                More · Click any cell for details
              </span>
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB
      ══════════════════════════════════════════════════ */}
      {tab === "activity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Glass style={{ padding: 20 }}>
            <SecLabel>Recent Activity</SecLabel>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {RECENT.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom:
                      i < RECENT.length - 1
                        ? `1px solid ${C.glassBorder}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: a.color + "18",
                      border: `1px solid ${a.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 17,
                      flexShrink: 0,
                    }}
                  >
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.text }}>{a.text}</div>
                    <div
                      style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}
                    >
                      {a.time}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: a.color,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </Glass>
          <Glass style={{ padding: 20 }}>
            <SecLabel>Monthly Summary — March 2026</SecLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[
                { l: "Journal entries", v: "11", c: C.yellow },
                { l: "Tasks completed", v: "34", c: C.green },
                { l: "Notes created", v: "6", c: C.blue },
                { l: "AI chats", v: "12", c: "#c4b5fd" },
                { l: "Budget used", v: "57%", c: C.violet },
                { l: "Avg mood", v: "😄 3.8", c: C.orange },
              ].map((s, i) => (
                <Glass key={i} style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, color: C.textDim }}>{s.l}</div>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: 20,
                      fontWeight: 700,
                      color: s.c,
                      marginTop: 4,
                    }}
                  >
                    {s.v}
                  </div>
                </Glass>
              ))}
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB
      ══════════════════════════════════════════════════ */}
      {tab === "budget" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* ── Budget overview card ── */}
          <Glass
            style={{
              padding: 22,
              background:
                "linear-gradient(135deg,rgba(124,58,237,.15),rgba(14,165,233,.06))",
              border: "1px solid rgba(124,58,237,.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}
                >
                  Monthly Budget
                </div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 34,
                    color: C.text,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ₹{budget.monthly.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 6 }}>
                  ₹
                  {Object.values(DEMO_EXPENSES_THIS_MONTH)
                    .reduce((s, v) => s + v, 0)
                    .toLocaleString()}{" "}
                  spent ·{" "}
                  <span style={{ color: C.green }}>
                    ₹
                    {(
                      budget.monthly -
                      Object.values(DEMO_EXPENSES_THIS_MONTH).reduce(
                        (s, v) => s + v,
                        0,
                      )
                    ).toLocaleString()}{" "}
                    remaining
                  </span>
                </div>
              </div>
              <Btn onClick={() => setBudgetModal(true)}>⚙ Edit Budget</Btn>
            </div>

            {/* Overall progress bar */}
            <div style={{ marginTop: 18 }}>
              {(() => {
                const spent = Object.values(DEMO_EXPENSES_THIS_MONTH).reduce(
                  (s, v) => s + v,
                  0,
                );
                const pct = Math.min(100, (spent / budget.monthly) * 100);
                const color =
                  pct >= 90 ? C.red : pct >= 75 ? C.yellow : C.green;
                return (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 12, color: C.textMid }}>
                        Overall spending
                      </span>
                      <span style={{ fontSize: 12, color, fontWeight: 600 }}>
                        {pct.toFixed(0)}% of budget
                      </span>
                    </div>
                    <div
                      style={{
                        height: 10,
                        background: "rgba(255,255,255,.08)",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: `linear-gradient(90deg,${color},${color}cc)`,
                          borderRadius: 6,
                          transition: "width .6s",
                        }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          </Glass>

          {/* ── Per-category budget bars ── */}
          <Glass style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <SecLabel>Category Budgets — March 2026</SecLabel>
              <button
                onClick={() => setBudgetModal(true)}
                style={{
                  fontSize: 12,
                  color: "#c4b5fd",
                  background: "rgba(124,58,237,.15)",
                  border: "1px solid rgba(124,58,237,.3)",
                  padding: "4px 12px",
                  borderRadius: 20,
                  cursor: "pointer",
                }}
              >
                Edit limits
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {BUDGET_CATS.map((cat) => {
                const limit = budget.categories[cat.key] ?? 0;
                const spent = DEMO_EXPENSES_THIS_MONTH[cat.key] ?? 0;
                const pct =
                  limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
                const over = spent > limit && limit > 0;
                const barClr = over
                  ? C.red
                  : pct >= budget.alertPct
                    ? C.yellow
                    : cat.color;

                return (
                  <div key={cat.key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: cat.color + "18",
                          border: `1px solid ${cat.color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {cat.icon}
                      </div>
                      {/* Label + amounts */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: C.text,
                              fontWeight: 500,
                            }}
                          >
                            {cat.label}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {over && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: C.red,
                                  background: "rgba(239,68,68,.12)",
                                  border: "1px solid rgba(239,68,68,.25)",
                                  padding: "1px 7px",
                                  borderRadius: 20,
                                  fontWeight: 600,
                                }}
                              >
                                Over by ₹{(spent - limit).toLocaleString()}
                              </span>
                            )}
                            {!over && pct >= budget.alertPct && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: C.yellow,
                                  background: "rgba(245,158,11,.12)",
                                  border: "1px solid rgba(245,158,11,.25)",
                                  padding: "1px 7px",
                                  borderRadius: 20,
                                  fontWeight: 600,
                                }}
                              >
                                {pct.toFixed(0)}% used
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: 12,
                                color: over ? C.red : C.textMid,
                                fontWeight: over ? 700 : 400,
                              }}
                            >
                              ₹{spent.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 12, color: C.textDim }}>
                              /
                            </span>
                            <span style={{ fontSize: 12, color: C.textDim }}>
                              ₹{limit > 0 ? limit.toLocaleString() : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    {limit > 0 ? (
                      <div
                        style={{
                          height: 6,
                          background: "rgba(255,255,255,.06)",
                          borderRadius: 4,
                          overflow: "hidden",
                          marginLeft: 42,
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: barClr,
                            borderRadius: 4,
                            transition: "width .6s",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 11,
                          color: C.textDim,
                          marginLeft: 42,
                        }}
                      >
                        No limit set
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Glass>

          {/* ── Budget tips ── */}
          <Glass
            style={{
              padding: 16,
              background: "rgba(124,58,237,.1)",
              border: "1px solid rgba(124,58,237,.25)",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 20 }}>⟡</span>
              <div>
                <div
                  style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}
                >
                  AI Budget Insight
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMid,
                    marginTop: 4,
                    lineHeight: 1.65,
                  }}
                >
                  You're tracking well this month Food is 80% of its limit with
                  20 days remaining — consider meal-prepping to stay under.
                  Health budget has ₹
                  {(
                    budget.categories.Health - DEMO_EXPENSES_THIS_MONTH.Health
                  ).toLocaleString()}{" "}
                  left.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {["Saving tips", "Adjust limits", "Monthly comparison"].map(
                    (x, i) => (
                      <Btn key={i} variant="ai" small>
                        {x}
                      </Btn>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Glass>

          {/* ── Budget settings toggles ── */}
          <Glass style={{ padding: 20 }}>
            <SecLabel>Budget Preferences</SecLabel>
            {[
              {
                key: "alerts",
                label: "Spending alerts",
                sub: `Notify when you reach ${budget.alertPct}% of any category limit`,
              },
              {
                key: "rollover",
                label: "Budget rollover",
                sub: "Carry unused budget from previous month to next",
              },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 0",
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${C.glassBorder}` : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                    {item.sub}
                  </div>
                </div>
                <Toggle
                  on={budget[item.key]}
                  onToggle={() => sb(item.key, !budget[item.key])}
                />
              </div>
            ))}
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB
      ══════════════════════════════════════════════════ */}
      {tab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Glass style={{ padding: 20 }}>
            <SecLabel>Account</SecLabel>
            <SettingRow
              icon="✏️"
              label="Edit profile info"
              sub="Name, bio, college, goal"
              onClick={() => setEditModal(true)}
            />
            <SettingRow
              icon="🔒"
              label="Change password"
              sub="Update your login password"
              onClick={() => setPassModal(true)}
            />
            <SettingRow
              icon="💰"
              label="Budget settings"
              sub="Limits, alerts, rollover"
              onClick={() => setTab("budget")}
            />
            <SettingRow
              icon="🔔"
              label="Notification settings"
              sub="Reminders, alerts, reports"
              onClick={() => setNotifModal(true)}
            />
            <SettingRow
              icon="📦"
              label="Export my data"
              sub="Download all data as JSON"
              onClick={() => {}}
              last
            />
          </Glass>
          <Glass style={{ padding: 20 }}>
            <SecLabel>Preferences</SecLabel>
            {[
              { icon: "🌙", label: "Theme", value: "Dark mode" },
              { icon: "🌐", label: "Language", value: "English" },
              { icon: "💱", label: "Currency", value: "₹ Indian Rupee" },
              { icon: "📅", label: "Date format", value: "DD/MM/YYYY" },
              { icon: "⟡", label: "AI personality", value: "Professional" },
            ].map((item, i, arr) => (
              <SettingRow
                key={i}
                icon={item.icon}
                label={item.label}
                last={i === arr.length - 1}
                right={
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMid,
                      background: "rgba(255,255,255,.05)",
                      padding: "4px 12px",
                      borderRadius: 20,
                      border: `1px solid ${C.glassBorder}`,
                      flexShrink: 0,
                    }}
                  >
                    {item.value}
                  </div>
                }
              />
            ))}
          </Glass>
          <Glass style={{ padding: 20 }}>
            <SecLabel>Notifications</SecLabel>
            {[
              {
                key: "dailyJournal",
                label: "Daily journal reminder",
                sub: "Every evening at 9 PM",
              },
              {
                key: "budgetAlert",
                label: "Budget alerts",
                sub: "At 80% of monthly budget",
              },
              {
                key: "weeklyReport",
                label: "Weekly AI report",
                sub: "Every Sunday morning",
              },
              {
                key: "moodCheckin",
                label: "Mood check-in",
                sub: "Evening at 8 PM",
              },
              {
                key: "taskDeadline",
                label: "Task deadline reminders",
                sub: "1 hour before due",
              },
              {
                key: "aiInsights",
                label: "AI insights",
                sub: "Tips and pattern findings",
              },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 0",
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${C.glassBorder}` : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                    {item.sub}
                  </div>
                </div>
                <Toggle
                  on={notifs[item.key]}
                  onToggle={() => toggleNotif(item.key)}
                />
              </div>
            ))}
          </Glass>
          <Glass
            style={{
              padding: 20,
              border: "1px solid rgba(239,68,68,.22)",
              background: "rgba(239,68,68,.04)",
            }}
          >
            <SecLabel>Danger Zone</SecLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                  Delete Account
                </div>
                <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>
                  Permanently delete your account and all data.
                </div>
              </div>
              <Btn variant="danger" onClick={() => setDelModal(true)}>
                🗑 Delete Account
              </Btn>
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════ */}

      {/* Edit Profile */}
      {editModal && (
        <Modal title="Edit Profile" onClose={() => setEditModal(false)} wide>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Glass
              style={{
                padding: 14,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#fff",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initials(form.name)}
              </div>
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>
                  {form.name}
                </div>
                <div style={{ fontSize: 12, color: C.textDim }}>
                  {form.email}
                </div>
              </div>
            </Glass>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FInput
                label="Full Name"
                value={form.name}
                onChange={(v) => sf("name", v)}
                placeholder="Arjun Sharma"
                required
              />
              <FInput
                label="Email"
                value={form.email}
                onChange={(v) => sf("email", v)}
                placeholder="you@email.com"
                type="email"
                required
              />
              <FInput
                label="Phone"
                value={form.phone}
                onChange={(v) => sf("phone", v)}
                placeholder="+91 ..."
              />
              <FInput
                label="Location"
                value={form.location}
                onChange={(v) => sf("location", v)}
                placeholder="City, State"
              />
              <FInput
                label="College/Work"
                value={form.college}
                onChange={(v) => sf("college", v)}
                placeholder="IIT Delhi"
              />
              <FSelect
                label="Year / Role"
                value={form.year}
                onChange={(v) => sf("year", v)}
                options={[
                  "1st Year",
                  "2nd Year",
                  "3rd Year",
                  "4th Year",
                  "Postgraduate",
                  "Working Professional",
                  "Other",
                ]}
              />
            </div>
            <FInput
              label="Goal"
              value={form.goal}
              onChange={(v) => sf("goal", v)}
              placeholder="What are you working towards?"
            />
            <FTextarea
              label="Bio"
              value={form.bio}
              onChange={(v) => sf("bio", v)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={saveProfile}>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setEditModal(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Password */}
      {passModal && (
        <Modal title="Change Password" onClose={() => setPassModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FInput
              label="Current Password"
              value={pf.cur}
              onChange={(v) => setPf((p) => ({ ...p, cur: v }))}
              placeholder="Enter current password"
              type="password"
              required
            />
            <FInput
              label="New Password"
              value={pf.nxt}
              onChange={(v) => setPf((p) => ({ ...p, nxt: v }))}
              placeholder="Min. 6 characters"
              type="password"
              required
            />
            <FInput
              label="Confirm Password"
              value={pf.cfm}
              onChange={(v) => setPf((p) => ({ ...p, cfm: v }))}
              placeholder="Re-enter new password"
              type="password"
              required
            />
            <Glass
              style={{
                padding: 12,
                background: "rgba(124,58,237,.08)",
                border: "1px solid rgba(124,58,237,.2)",
              }}
            >
              <div style={{ fontSize: 12, color: "#c4b5fd" }}>
                💡 Use 8+ characters with numbers and symbols.
              </div>
            </Glass>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn
                onClick={savePass}
                disabled={!pf.cur || !pf.nxt || pf.nxt == pf.cfm}
              >
                Update Password
              </Btn>
              <Btn variant="ghost" onClick={() => setPassModal(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── BUDGET EDIT MODAL ── */}
      {budgetModal && (
        <Modal
          title="💰 Set Monthly Budget"
          onClose={() => setBudgetModal(false)}
          wide
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Total monthly budget */}
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(124,58,237,.1)",
                border: "1px solid rgba(124,58,237,.25)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#c4b5fd",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                Total Monthly Budget
              </div>
              <FInput
                label="Total limit (₹)"
                type="number"
                value={String(budget.monthly)}
                onChange={(v) => sb("monthly", Math.max(0, Number(v)))}
                placeholder="5000"
                required
              />
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>
                This is your overall monthly spending cap across all categories.
              </div>
            </div>

            {/* Per-category limits */}
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: C.text,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Per Category Limits
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 14 }}>
                Set limits for individual categories. Leave 0 for no limit.
              </div>

              {/* Category total vs monthly warning */}
              {catOverflow && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(239,68,68,.1)",
                    border: "1px solid rgba(239,68,68,.25)",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 12, color: C.red }}>
                    ⚠ Category totals (₹{catTotal.toLocaleString()}) exceed
                    monthly budget (₹{budget.monthly.toLocaleString()}).
                    Consider adjusting.
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {BUDGET_CATS.map((cat) => (
                  <div key={cat.key}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        fontSize: 12,
                        color: C.textMid,
                        fontWeight: 500,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 15 }}>{cat.icon}</span>
                      {cat.label}
                      {budget.categories[cat.key] > 0 && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 10,
                            color: cat.color,
                          }}
                        >
                          ₹{budget.categories[cat.key].toLocaleString()}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      value={budget.categories[cat.key] || ""}
                      onChange={(e) =>
                        setCatBudget(
                          cat.key,
                          Math.max(0, Number(e.target.value)),
                        )
                      }
                      placeholder="0 = no limit"
                      style={{
                        background: "rgba(255,255,255,.05)",
                        border: `1px solid ${C.glassBorder}`,
                        borderRadius: 10,
                        padding: "9px 13px",
                        color: C.text,
                        fontSize: 13,
                        outline: "none",
                        width: "100%",
                      }}
                    />
                    {/* Mini bar showing current usage vs new limit */}
                    {budget.categories[cat.key] > 0 && (
                      <div
                        style={{
                          marginTop: 5,
                          height: 4,
                          background: "rgba(255,255,255,.06)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, ((DEMO_EXPENSES_THIS_MONTH[cat.key] ?? 0) / budget.categories[cat.key]) * 100)}%`,
                            height: "100%",
                            background: cat.color,
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Category total summary */}
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.03)",
                  border: `1px solid ${C.glassBorder}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, color: C.textMid }}>
                  Category totals
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: catOverflow ? C.red : C.green,
                  }}
                >
                  ₹{catTotal.toLocaleString()} / ₹
                  {budget.monthly.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Alert threshold */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}
                >
                  Alert at % of budget
                </label>
                <span
                  style={{ fontSize: 13, color: C.violet, fontWeight: 700 }}
                >
                  {budget.alertPct}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                step={5}
                value={budget.alertPct}
                onChange={(e) => sb("alertPct", Number(e.target.value))}
                style={{ width: "100%", accentColor: C.violet }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: C.textDim }}>50%</span>
                <span style={{ fontSize: 10, color: C.textDim }}>95%</span>
              </div>
            </div>

            {/* Preferences toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  key: "alerts",
                  label: "Enable spending alerts",
                  sub: `Alert when reaching ${budget.alertPct}% of any limit`,
                },
                {
                  key: "rollover",
                  label: "Enable budget rollover",
                  sub: "Carry unused budget to next month",
                },
              ].map((item, i, arr) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? `1px solid ${C.glassBorder}`
                        : "none",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 13, color: C.text, fontWeight: 500 }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}
                    >
                      {item.sub}
                    </div>
                  </div>
                  <Toggle
                    on={budget[item.key]}
                    onToggle={() => sb(item.key, !budget[item.key])}
                  />
                </div>
              ))}
            </div>

            {/* Save button */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                onClick={saveBudget}
                disabled={budgetSaving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background: budgetSaving
                    ? "rgba(124,58,237,.4)"
                    : `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  border: "none",
                  color: "#fff",
                  cursor: budgetSaving ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {budgetSaving ? (
                  <>
                    <InlineLoader size={14} color="#fff" /> Saving...
                  </>
                ) : (
                  "Save Budget"
                )}
              </button>
              <Btn variant="ghost" onClick={() => setBudgetModal(false)}>
                Cancel
              </Btn>
              <button
                onClick={() => setBudget(DEFAULT_BUDGET)}
                style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  color: C.textDim,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Notifications */}
      {notifModal && (
        <Modal
          title="Notification Settings"
          onClose={() => setNotifModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              {
                key: "dailyJournal",
                label: "Daily journal reminder",
                sub: "Every evening at 9 PM",
              },
              {
                key: "budgetAlert",
                label: "Budget alerts",
                sub: "At 80% of monthly budget",
              },
              {
                key: "weeklyReport",
                label: "Weekly AI report",
                sub: "Every Sunday morning",
              },
              {
                key: "moodCheckin",
                label: "Mood check-in",
                sub: "Evening at 8 PM",
              },
              {
                key: "taskDeadline",
                label: "Task deadline reminders",
                sub: "1 hour before due",
              },
              {
                key: "aiInsights",
                label: "AI insights",
                sub: "Tips and pattern findings",
              },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 0",
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${C.glassBorder}` : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                    {item.sub}
                  </div>
                </div>
                <Toggle
                  on={notifs[item.key]}
                  onToggle={() => toggleNotif(item.key)}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn onClick={() => setNotifModal(false)}>Save Preferences</Btn>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {delModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
        >
          <div
            className="modal-in"
            style={{
              padding: 28,
              maxWidth: 340,
              width: "90%",
              background: "#111827",
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 20,
            }}
          >
            <div
              style={{ fontSize: 30, textAlign: "center", marginBottom: 12 }}
            >
              ⚠️
            </div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 17,
                color: C.text,
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Delete Account?
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.textMid,
                lineHeight: 1.7,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              This will permanently delete your account and{" "}
              <strong style={{ color: C.red }}>all your data</strong>. Cannot be
              undone.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn variant="danger" onClick={() => setDelModal(false)}>
                Yes, Delete Everything
              </Btn>
              <Btn variant="ghost" onClick={() => setDelModal(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
