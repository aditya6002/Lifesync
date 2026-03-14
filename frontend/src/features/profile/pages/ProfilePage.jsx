// src/modules/profile/ProfilePage.jsx
import { useState } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import {
  Glass,
  Btn,
  FInput,
  FTextarea,
  FSelect,
} from "../../../shared/components/ui/Atoms";
import { Modal } from "../../../shared/components/ui/Modal";

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

// ── Small section label — matches app's "Monthly Spending" label style ──
function SecLabel({ children }) {
  return (
    <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ── Section heading — matches app's page title style ─────
function SecTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: FONTS.display,
        fontSize: 22,
        color: C.text,
        marginBottom: 0,
      }}
    >
      {children}
    </h2>
  );
}

// ── Row item inside a Glass card — matches expense/task row style ──
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

// ── Toggle switch — same pill style used across app ───────
function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: on
          ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
          : "rgba(255,255,255,.08)",
        cursor: "pointer",
        position: "relative",
        transition: "background .2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s",
          boxShadow: "0 2px 6px rgba(0,0,0,.3)",
        }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export default function ProfilePage({ user, onUpdateUser, toast }) {
  const [tab, setTab] = useState("overview");

  // profile form
  const [form, setForm] = useState({
    name: user?.name || "Arjun Sharma",
    email: user?.email || "arjun@lumina.app",
    phone: "+91 98765 43210",
    bio: "B.Tech CSE · IIT Delhi · Love building things and tracking habits.",
    location: "New Delhi, India",
    college: "IIT Delhi",
    year: "3rd Year",
    goal: "Crack Google SWE by June 2026",
  });
  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // modals
  const [editModal, setEditModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [delModal, setDelModal] = useState(false);

  // password form
  const [pf, setPf] = useState({ cur: "", nxt: "", cfm: "" });

  // notification toggles
  const [notifs, setNotifs] = useState({
    dailyJournal: true,
    budgetAlert: true,
    weeklyReport: true,
    moodCheckin: false,
    taskDeadline: true,
    aiInsights: true,
  });
  const toggleNotif = (k) => setNotifs((n) => ({ ...n, [k]: !n[k] }));

  // heatmap — stable random data + click tooltip
  const [heatmap] = useState(() =>
    Array.from({ length: 70 }, (_, i) => {
      const date = new Date(2026, 0, 1);
      date.setDate(date.getDate() + i);
      const lvl = Math.random() > 0.38 ? Math.floor(Math.random() * 4) + 1 : 0;
      const acts = [
        "Wrote journal",
        "Added expense",
        "Completed tasks",
        "Updated notes",
        "Used AI assistant",
      ];
      return {
        i,
        lvl,
        date: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        label:
          lvl === 0
            ? "No activity"
            : `${lvl} ${acts[Math.floor(Math.random() * acts.length)]}`,
      };
    }),
  );
  const [tooltip, setTooltip] = useState(null); // { i, x, y, date, label, lvl }

  const saveProfile = () => {
    onUpdateUser?.({ name: form.name, email: form.email });
    setEditModal(false);
    toast("Profile updated ✓");
  };

  const savePass = () => {
    if (!pf.cur || !pf.nxt) return;
    if (pf.nxt !== pf.cfm) {
      toast("Passwords don't match!");
      return;
    }
    setPassModal(false);
    setPf({ cur: "", nxt: "", cfm: "" });
    toast("Password changed ✓");
  };

  const TABS = ["overview", "activity", "settings"];

  // score breakdown — matches dashboard stat card style
  const scoreBreakdown = [
    { label: "Tasks completed today", score: 50, weight: "40%", color: C.red },
    { label: "Journal written", score: 100, weight: "25%", color: C.yellow },
    { label: "Budget on track", score: 100, weight: "20%", color: C.violet },
    { label: "Notes updated", score: 100, weight: "15%", color: C.blue },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* ── PAGE HEADER — same pattern as every other page ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SecTitle>Profile</SecTitle>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setEditModal(true)}>✏️ Edit Profile</Btn>
          <Btn variant="ghost" onClick={() => setPassModal(true)}>
            🔒 Password
          </Btn>
        </div>
      </div>

      {/* ── PROFILE HERO — same gradient banner as dashboard welcome ── */}
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
          {/* Avatar — same violet gradient used everywhere */}
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
              }}
            >
              {initials(form.name)}
            </div>
            {/* Online dot */}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                color: "#fff",
              }}
            >
              ●
            </div>
          </div>

          {/* Info */}
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
            {/* Goal chip — same style as streak badge in other pages */}
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

          {/* Score — same as dashboard 82% block */}
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

        {/* Stat strip — same as dashboard stat cards but horizontal */}
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
            { label: "Spent", value: "₹12,450", icon: "◈", color: C.violet },
            {
              label: "Journal streak",
              value: "7 days 🔥",
              icon: "✦",
              color: C.yellow,
            },
            { label: "Tasks done", value: "34", icon: "◎", color: C.green },
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

      {/* ── TABS — same filter chip style as expenses filter bar ── */}
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
            {t}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Productivity score — mirrors dashboard bottom-left card */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Glass style={{ padding: 20 }}>
              <SecLabel>Productivity Score</SecLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Circle gauge */}
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
                    stroke={`url(#pg)`}
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
                {/* Bars */}
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

            {/* AI insight — same as in expenses/tasks pages */}
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
                    You've been most productive on Tuesdays and Thursdays. Your
                    mood positively correlates with gym days. Journal streak is
                    your strongest habit — keep it up!
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

          {/* Achievements — same card style as stat cards */}
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

          {/* Heatmap — same subdued style */}
          <Glass style={{ padding: 20 }}>
            <SecLabel>Activity — Last 70 Days</SecLabel>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {heatmap.map((d) => (
                  <div
                    key={d.i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: HEATMAP_COLS[d.lvl],
                      cursor: "pointer",
                      transition: "transform .15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.4)";
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        i: d.i,
                        date: d.date,
                        label: d.label,
                        lvl: d.lvl,
                        x: rect.left,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      setTooltip(null);
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip((t) =>
                        t?.i === d.i
                          ? null
                          : {
                              i: d.i,
                              date: d.date,
                              label: d.label,
                              lvl: d.lvl,
                              x: rect.left,
                              y: rect.top,
                            },
                      );
                    }}
                  />
                ))}
              </div>

              {/* Inline tooltip that appears below heatmap */}
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
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

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
              <span style={{ fontSize: 10, color: C.textDim }}>More</span>
              <span style={{ fontSize: 10, color: C.textDim, marginLeft: 8 }}>
                · Click any cell to see details
              </span>
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: ACTIVITY
      ══════════════════════════════════════════════════ */}
      {tab === "activity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Recent activity — same row style as dashboard recent activity */}
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

          {/* Monthly summary — same 3-col summary cards as expenses page */}
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
                { label: "Journal entries", value: "11", color: C.yellow },
                { label: "Tasks completed", value: "34", color: C.green },
                { label: "Notes created", value: "6", color: C.blue },
                { label: "AI chats", value: "12", color: "#c4b5fd" },
                { label: "Budget used", value: "57%", color: C.violet },
                { label: "Average mood", value: "😄 3.8", color: C.orange },
              ].map((s, i) => (
                <Glass key={i} style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, color: C.textDim }}>
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: 20,
                      fontWeight: 700,
                      color: s.color,
                      marginTop: 4,
                    }}
                  >
                    {s.value}
                  </div>
                </Glass>
              ))}
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: SETTINGS
      ══════════════════════════════════════════════════ */}
      {tab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Account */}
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
              icon="🔔"
              label="Notification settings"
              sub="Reminders, alerts, reports"
              onClick={() => setNotifModal(true)}
            />
            <SettingRow
              icon="📦"
              label="Export my data"
              sub="Download all data as JSON"
              onClick={() => toast("Downloading data...")}
              last
            />
          </Glass>

          {/* Preferences — same label+value style as task/note rows */}
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

          {/* Notifications — direct rows, no SettingRow wrapper to avoid click conflict with Toggle */}
          <Glass style={{ padding: 20 }}>
            <SecLabel>Notifications</SecLabel>
            {[
              {
                key: "dailyJournal",
                icon: "📓",
                label: "Daily journal reminder",
                sub: "Remind me every evening at 9 PM",
              },
              {
                key: "budgetAlert",
                icon: "💸",
                label: "Expense budget alerts",
                sub: "Alert at 80% of monthly budget",
              },
              {
                key: "weeklyReport",
                icon: "📊",
                label: "Weekly AI report",
                sub: "Summary every Sunday morning",
              },
              {
                key: "moodCheckin",
                icon: "😊",
                label: "Evening mood check-in",
                sub: "Ask me how I'm feeling at 8 PM",
              },
              {
                key: "taskDeadline",
                icon: "⏰",
                label: "Task deadline reminders",
                sub: "Notify 1 hour before due time",
              },
              {
                key: "aiInsights",
                icon: "⟡",
                label: "AI insight notifications",
                sub: "Show tips and pattern findings",
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
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                    {item.sub}
                  </div>
                </div>
                {/* Toggle — standalone click, no parent onClick to conflict */}
                <div
                  onClick={() => toggleNotif(item.key)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: notifs[item.key]
                      ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                      : "rgba(255,255,255,.08)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background .25s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: notifs[item.key] ? 20 : 2,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left .25s",
                      boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                    }}
                  />
                </div>
              </div>
            ))}
          </Glass>

          {/* Danger zone — same pattern as modal danger button */}
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
                  Permanently delete your account and all data. Cannot be
                  undone.
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
          MODALS — all use the same Modal wrapper as the rest of the app
      ══════════════════════════════════════════════════ */}

      {/* Edit Profile */}
      {editModal && (
        <Modal title="Edit Profile" onClose={() => setEditModal(false)} wide>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Avatar preview row — same Glass mini card style */}
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
            {/* Tip card — same AI insight card style */}
            <Glass
              style={{
                padding: 12,
                background: "rgba(124,58,237,.08)",
                border: "1px solid rgba(124,58,237,.2)",
              }}
            >
              <div style={{ fontSize: 12, color: "#c4b5fd" }}>
                💡 Use 8+ characters with numbers and symbols for a strong
                password.
              </div>
            </Glass>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={savePass} disabled={!pf.cur || !pf.nxt}>
                Update Password
              </Btn>
              <Btn variant="ghost" onClick={() => setPassModal(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Notification Settings */}
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
                <div
                  onClick={() => toggleNotif(item.key)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: notifs[item.key]
                      ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                      : "rgba(255,255,255,.08)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background .25s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: notifs[item.key] ? 20 : 2,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left .25s",
                      boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn
              onClick={() => {
                setNotifModal(false);
                toast("Notification preferences saved ✓");
              }}
            >
              Save Preferences
            </Btn>
          </div>
        </Modal>
      )}

      {/* Delete Confirm — same confirm pattern as delete in other modules */}
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
              <strong style={{ color: C.red }}>all your data</strong>. This
              action cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn
                variant="danger"
                onClick={() => {
                  setDelModal(false);
                  toast("Account deletion requested");
                }}
              >
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
