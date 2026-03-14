// src/modules/profile/ProfilePage.jsx
import { useState } from "react";
import { C, FONTS } from "../../styles/tokens";
import { Glass, Btn, FInput, FSelect, Toast } from "../../components/ui/Atoms";
import { Modal } from "../../components/ui/Model";

// ── Demo stats ────────────────────────────────────────────
const STATS = [
  {
    icon: "◈",
    label: "Total Expenses",
    value: "₹12,450",
    sub: "This month",
    color: C.violet,
  },
  {
    icon: "✦",
    label: "Journal Streak",
    value: "7 days",
    sub: "🔥 Keep it up",
    color: C.yellow,
  },
  {
    icon: "◎",
    label: "Tasks Completed",
    value: "34",
    sub: "This month",
    color: C.green,
  },
  {
    icon: "◇",
    label: "Notes Created",
    value: "24",
    sub: "All time",
    color: C.blue,
  },
];

const ACTIVITY_HEATMAP = Array.from({ length: 70 }, (_, i) => ({
  day: i,
  level: Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0,
}));

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
    desc: "Use all 5 modules in a single day",
    earned: false,
  },
];

const RECENT_ACTIVITY = [
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

const HEATMAP_COLORS = [
  "rgba(255,255,255,0.05)",
  "rgba(124,58,237,0.2)",
  "rgba(124,58,237,0.4)",
  "rgba(124,58,237,0.65)",
  "rgba(124,58,237,0.9)",
];

// ── Avatar initials helper ────────────────────────────────
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Section heading ───────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontFamily: FONTS.display,
        fontSize: 16,
        color: C.text,
        fontWeight: 700,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════════════════════════
export default function ProfilePage({ user, onUpdateUser, toast }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editModal, setEditModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Edit profile form
  const [form, setForm] = useState({
    name: user?.name || "Arjun Sharma",
    email: user?.email || "arjun@lumina.app",
    phone: "+91 98765 43210",
    bio: "B.Tech CSE student at IIT Delhi. Love building things and tracking habits.",
    location: "New Delhi, India",
    college: "IIT Delhi",
    year: "3rd Year",
    goal: "Crack Google SWE interview by June 2026",
  });

  // Notification prefs
  const [notifs, setNotifs] = useState({
    dailyReminder: true,
    expenseAlert: true,
    weeklyReport: true,
    moodCheckIn: false,
    taskDeadline: true,
    aiInsights: true,
  });

  // Password form
  const [passForm, setPassForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const saveProfile = () => {
    onUpdateUser?.({ name: form.name, email: form.email });
    setEditModal(false);
    toast("Profile updated ✓");
  };

  const savePassword = () => {
    if (!passForm.current || !passForm.newPass) return;
    if (passForm.newPass !== passForm.confirm) {
      toast("Passwords don't match!");
      return;
    }
    setPassModal(false);
    setPassForm({ current: "", newPass: "", confirm: "" });
    toast("Password changed ✓");
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* ── PROFILE HEADER CARD ── */}
      <Glass
        style={{
          padding: 28,
          background:
            "linear-gradient(135deg,rgba(124,58,237,.18),rgba(14,165,233,.07))",
          border: "1px solid rgba(124,58,237,.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 22,
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#fff",
                fontWeight: 700,
                fontFamily: FONTS.display,
                boxShadow: "0 8px 28px rgba(124,58,237,.4)",
              }}
            >
              {initials(form.name)}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 22,
                height: 22,
                borderRadius: 8,
                background: C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                border: `2px solid ${C.bg}`,
              }}
            >
              ●
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 24,
                color: C.text,
                fontWeight: 700,
              }}
            >
              {form.name}
            </div>
            <div style={{ fontSize: 13, color: C.textMid, marginTop: 3 }}>
              {form.email}
            </div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>
              {form.college} · {form.year} · {form.location}
            </div>
            {form.bio && (
              <div
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  marginTop: 8,
                  fontStyle: "italic",
                  maxWidth: 480,
                  lineHeight: 1.6,
                }}
              >
                "{form.bio}"
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
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
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn onClick={() => setEditModal(true)}>✏️ Edit Profile</Btn>
            <Btn variant="ghost" onClick={() => setPassModal(true)}>
              🔒 Change Password
            </Btn>
          </div>
        </div>

        {/* Stat strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginTop: 22,
            paddingTop: 20,
            borderTop: `1px solid ${C.glassBorder}`,
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, color: s.color, marginBottom: 4 }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 18,
                  color: C.text,
                  fontWeight: 700,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: s.color, marginTop: 2 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </Glass>

      {/* ── TABS ── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "rgba(255,255,255,.03)",
          borderRadius: 12,
          padding: 4,
          border: `1px solid ${C.glassBorder}`,
          alignSelf: "flex-start",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 22px",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background:
                activeTab === t.id
                  ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                  : "transparent",
              color: activeTab === t.id ? "#fff" : C.textMid,
              transition: "all .18s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Productivity score */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>📊 Productivity Score</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 24,
                alignItems: "center",
              }}
            >
              {/* Big circle score */}
              <div style={{ position: "relative", width: 110, height: 110 }}>
                <svg width={110} height={110} viewBox="0 0 110 110">
                  <circle
                    cx={55}
                    cy={55}
                    r={46}
                    fill="none"
                    stroke="rgba(255,255,255,.06)"
                    strokeWidth={10}
                  />
                  <circle
                    cx={55}
                    cy={55}
                    r={46}
                    fill="none"
                    stroke={`url(#scoreGrad)`}
                    strokeWidth={10}
                    strokeDasharray={`${0.82 * 2 * Math.PI * 46} ${2 * Math.PI * 46}`}
                    strokeDashoffset={2 * Math.PI * 46 * 0.25}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="scoreGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor={C.violet} />
                      <stop offset="100%" stopColor={C.violetLight} />
                    </linearGradient>
                  </defs>
                  <text
                    x={55}
                    y={50}
                    textAnchor="middle"
                    fill={C.text}
                    fontSize={22}
                    fontWeight="700"
                    fontFamily={FONTS.display}
                  >
                    82%
                  </text>
                  <text
                    x={55}
                    y={66}
                    textAnchor="middle"
                    fill={C.textDim}
                    fontSize={10}
                  >
                    Today
                  </text>
                </svg>
              </div>

              {/* Score breakdown */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: "Tasks completed",
                    score: 50,
                    weight: "40%",
                    color: C.red,
                  },
                  {
                    label: "Journal written",
                    score: 100,
                    weight: "25%",
                    color: C.yellow,
                  },
                  {
                    label: "Budget on track",
                    score: 100,
                    weight: "20%",
                    color: C.violet,
                  },
                  {
                    label: "Notes updated",
                    score: 100,
                    weight: "15%",
                    color: C.blue,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{ fontSize: 11, color: C.textMid, width: 140 }}
                    >
                      {item.label}
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
                          width: `${item.score}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: 4,
                          transition: "width .6s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: C.textDim,
                        width: 30,
                        textAlign: "right",
                      }}
                    >
                      {item.score}%
                    </span>
                    <span style={{ fontSize: 10, color: C.textDim, width: 28 }}>
                      {item.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Glass>

          {/* Achievements */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>🏆 Achievements</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
                gap: 12,
              }}
            >
              {ACHIEVEMENTS.map((a, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: a.earned
                      ? "rgba(124,58,237,.1)"
                      : "rgba(255,255,255,.02)",
                    border: a.earned
                      ? "1px solid rgba(124,58,237,.3)"
                      : `1px solid ${C.glassBorder}`,
                    opacity: a.earned ? 1 : 0.5,
                    transition: "all .2s",
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{a.icon}</div>
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
                        marginTop: 6,
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

          {/* Activity heatmap */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>📅 Activity Heatmap — Last 70 Days</SectionTitle>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {ACTIVITY_HEATMAP.map((d, i) => (
                <div
                  key={i}
                  title={`Day ${i + 1}`}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: HEATMAP_COLORS[d.level],
                    transition: "transform .15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 12,
              }}
            >
              <span style={{ fontSize: 11, color: C.textDim }}>Less</span>
              {HEATMAP_COLORS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: c,
                  }}
                />
              ))}
              <span style={{ fontSize: 11, color: C.textDim }}>More</span>
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB: ACTIVITY
      ══════════════════════════════════════════════════ */}
      {activeTab === "activity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Glass style={{ padding: 22 }}>
            <SectionTitle>🕐 Recent Activity</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {RECENT_ACTIVITY.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      i < RECENT_ACTIVITY.length - 1
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
                      style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}
                    >
                      {a.time}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: a.color,
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  />
                </div>
              ))}
            </div>
          </Glass>

          {/* Monthly summary */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>📈 Monthly Summary — March 2026</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
                gap: 14,
              }}
            >
              {[
                {
                  label: "Entries written",
                  value: "11",
                  icon: "✦",
                  color: C.yellow,
                  prog: 73,
                },
                {
                  label: "Tasks completed",
                  value: "34",
                  icon: "◎",
                  color: C.green,
                  prog: 85,
                },
                {
                  label: "Notes created",
                  value: "6",
                  icon: "◇",
                  color: C.blue,
                  prog: 60,
                },
                {
                  label: "AI chats",
                  value: "12",
                  icon: "⟡",
                  color: "#c4b5fd",
                  prog: 40,
                },
                {
                  label: "Budget used",
                  value: "57%",
                  icon: "◈",
                  color: C.violet,
                  prog: 57,
                },
                {
                  label: "Avg mood",
                  value: "😄 3.8",
                  icon: "",
                  color: C.orange,
                  prog: 76,
                },
              ].map((s, i) => (
                <Glass key={i} style={{ padding: 16 }}>
                  <div
                    style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}
                  >
                    {s.icon} {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: 20,
                      color: C.text,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "rgba(255,255,255,.06)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${s.prog}%`,
                        height: "100%",
                        background: s.color,
                        borderRadius: 4,
                      }}
                    />
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
      {activeTab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Account settings */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>👤 Account Settings</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  label: "Edit profile info",
                  sub: "Name, bio, college, goal",
                  icon: "✏️",
                  action: () => setEditModal(true),
                },
                {
                  label: "Change password",
                  sub: "Update your login password",
                  icon: "🔒",
                  action: () => setPassModal(true),
                },
                {
                  label: "Notification settings",
                  sub: "Reminders, alerts, reports",
                  icon: "🔔",
                  action: () => setNotifModal(true),
                },
                {
                  label: "Export my data",
                  sub: "Download all your data as JSON",
                  icon: "📦",
                  action: () => toast("Downloading data..."),
                },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  onClick={item.action}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? `1px solid ${C.glassBorder}`
                        : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = ".75")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
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
                  <span style={{ fontSize: 16, color: C.textDim }}>→</span>
                </div>
              ))}
            </div>
          </Glass>

          {/* Preferences */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>⚙️ Preferences</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Theme", value: "Dark mode", icon: "🌙" },
                { label: "Language", value: "English", icon: "🌐" },
                { label: "Currency", value: "₹ Indian Rupee", icon: "💱" },
                { label: "Date format", value: "DD/MM/YYYY", icon: "📅" },
                { label: "AI personality", value: "Professional", icon: "⟡" },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "13px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? `1px solid ${C.glassBorder}`
                        : "none",
                  }}
                >
                  <span style={{ fontSize: 17, width: 28 }}>{item.icon}</span>
                  <div style={{ flex: 1, fontSize: 13, color: C.text }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMid,
                      background: "rgba(255,255,255,.05)",
                      padding: "4px 12px",
                      borderRadius: 20,
                      border: `1px solid ${C.glassBorder}`,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </Glass>

          {/* Notifications toggle list */}
          <Glass style={{ padding: 22 }}>
            <SectionTitle>🔔 Notifications</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {Object.entries({
                dailyReminder: "Daily journal reminder",
                expenseAlert: "Expense budget alerts",
                weeklyReport: "Weekly AI report",
                moodCheckIn: "Evening mood check-in",
                taskDeadline: "Task deadline reminders",
                aiInsights: "AI insight notifications",
              }).map(([key, label], i, arr) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? `1px solid ${C.glassBorder}`
                        : "none",
                  }}
                >
                  <div style={{ flex: 1, fontSize: 13, color: C.text }}>
                    {label}
                  </div>
                  {/* Toggle switch */}
                  <div
                    onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                    style={{
                      width: 42,
                      height: 24,
                      borderRadius: 12,
                      background: notifs[key]
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
                        top: 3,
                        left: notifs[key] ? 20 : 3,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left .2s",
                        boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Glass>

          {/* Danger zone */}
          <Glass
            style={{
              padding: 22,
              border: "1px solid rgba(239,68,68,.25)",
              background: "rgba(239,68,68,.04)",
            }}
          >
            <SectionTitle>⚠️ Danger Zone</SectionTitle>
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
                  Permanently delete your account and all data. This cannot be
                  undone.
                </div>
              </div>
              <Btn variant="danger" onClick={() => setDeleteModal(true)}>
                🗑 Delete Account
              </Btn>
            </div>
          </Glass>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════ */}

      {/* Edit Profile Modal */}
      {editModal && (
        <Modal title="Edit Profile" onClose={() => setEditModal(false)} wide>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Avatar preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                background: "rgba(255,255,255,.03)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {initials(form.name)}
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                  {form.name}
                </div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                  {form.email}
                </div>
              </div>
            </div>

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
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Arjun Sharma"
                required
              />
              <FInput
                label="Email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="you@email.com"
                type="email"
                required
              />
              <FInput
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                placeholder="+91 ..."
              />
              <FInput
                label="Location"
                value={form.location}
                onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                placeholder="City, State"
              />
              <FInput
                label="College/Work"
                value={form.college}
                onChange={(v) => setForm((f) => ({ ...f, college: v }))}
                placeholder="IIT Delhi"
              />
              <FSelect
                label="Year / Role"
                value={form.year}
                onChange={(v) => setForm((f) => ({ ...f, year: v }))}
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
              label="Your Goal"
              value={form.goal}
              onChange={(v) => setForm((f) => ({ ...f, goal: v }))}
              placeholder="What are you working towards?"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label
                style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}
              >
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
                placeholder="Tell us about yourself..."
                rows={3}
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${C.glassBorder}`,
                  borderRadius: 10,
                  padding: "10px 13px",
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={saveProfile}>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setEditModal(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Password Modal */}
      {passModal && (
        <Modal title="Change Password" onClose={() => setPassModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FInput
              label="Current Password"
              value={passForm.current}
              onChange={(v) => setPassForm((f) => ({ ...f, current: v }))}
              placeholder="Enter current password"
              type="password"
              required
            />
            <FInput
              label="New Password"
              value={passForm.newPass}
              onChange={(v) => setPassForm((f) => ({ ...f, newPass: v }))}
              placeholder="Min. 6 characters"
              type="password"
              required
            />
            <FInput
              label="Confirm Password"
              value={passForm.confirm}
              onChange={(v) => setPassForm((f) => ({ ...f, confirm: v }))}
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
                💡 Use at least 8 characters with numbers and symbols for a
                strong password.
              </div>
            </Glass>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn
                onClick={savePassword}
                disabled={!passForm.current || !passForm.newPass}
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

      {/* Notification Modal */}
      {notifModal && (
        <Modal
          title="Notification Settings"
          onClose={() => setNotifModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {Object.entries({
              dailyReminder: {
                label: "Daily journal reminder",
                sub: "Remind me to write every evening at 9 PM",
              },
              expenseAlert: {
                label: "Expense budget alerts",
                sub: "Alert when I exceed 80% of my monthly budget",
              },
              weeklyReport: {
                label: "Weekly AI report",
                sub: "Get a summary every Sunday morning",
              },
              moodCheckIn: {
                label: "Evening mood check-in",
                sub: "Ask me how I'm feeling at 8 PM",
              },
              taskDeadline: {
                label: "Task deadline reminders",
                sub: "Notify me 1 hour before task due time",
              },
              aiInsights: {
                label: "AI insight notifications",
                sub: "Show AI-generated tips and patterns",
              },
            }).map(([key, item], i, arr) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 0",
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
                  onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                  style={{
                    width: 42,
                    height: 24,
                    borderRadius: 12,
                    background: notifs[key]
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
                      top: 3,
                      left: notifs[key] ? 20 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left .2s",
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

      {/* Delete Account Confirm */}
      {deleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
        >
          <Glass
            className="modal-in"
            style={{ padding: 28, maxWidth: 380, width: "90%" }}
          >
            <div
              style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}
            >
              ⚠️
            </div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 18,
                color: C.text,
                fontWeight: 700,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Delete Account?
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.textMid,
                lineHeight: 1.7,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              This will permanently delete your account and{" "}
              <strong style={{ color: C.red }}>all your data</strong> —
              expenses, journals, notes, tasks. This action{" "}
              <strong>cannot be undone.</strong>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn
                variant="danger"
                onClick={() => {
                  setDeleteModal(false);
                  toast("Account deletion requested");
                }}
              >
                Yes, Delete Everything
              </Btn>
              <Btn variant="ghost" onClick={() => setDeleteModal(false)}>
                Cancel
              </Btn>
            </div>
          </Glass>
        </div>
      )}
    </div>
  );
}
