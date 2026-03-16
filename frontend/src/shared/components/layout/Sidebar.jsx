// src/shared/components/layout/Sidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { initials } from "../../utils/helpers";

const C = {
  violet: "#7C3AED",
  violetLight: "#a855f7",
  text: "#f1f5f9",
  textMid: "#94a3b8",
  textDim: "#475569",
  glass: "rgba(255,255,255,.04)",
  glassBorder: "rgba(255,255,255,.08)",
  red: "#ef4444",
  bg: "#07090f",
};

const NAV = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/expenses", icon: "◈", label: "Expenses" },
  { path: "/journal", icon: "✦", label: "Journal" },
  { path: "/notes", icon: "◇", label: "Notes" },
  { path: "/tasks", icon: "◎", label: "Tasks" },
  { path: "/ai", icon: "⟡", label: "AI Assistant" },
];

export default function Sidebar({ open, setOpen, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        width: open ? 210 : 60,
        transition: "width .28s ease",
        background: "rgba(10,14,22,.98)",
        borderRight: `1px solid ${C.glassBorder}`,
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: `0 ${open ? 16 : 10}px 16px`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: `1px solid ${C.glassBorder}`,
          marginBottom: 12,
          justifyContent: open ? "flex-start" : "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(124,58,237,.3)",
          }}
        >
          ✦
        </div>
        {open && (
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 17,
              color: C.text,
              fontWeight: 700,
            }}
          >
            Lumina
          </span>
        )}
      </div>

      {/* Nav items */}
      {NAV.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: open ? "10px 16px" : "10px 0",
            justifyContent: open ? "flex-start" : "center",
            background: isActive(item.path)
              ? "rgba(124,58,237,.15)"
              : "transparent",
            border: "none",
            borderLeft: isActive(item.path)
              ? `3px solid ${C.violet}`
              : "3px solid transparent",
            color: isActive(item.path) ? "#c4b5fd" : C.textDim,
            cursor: "pointer",
            transition: "all .15s",
            width: "100%",
            marginBottom: 2,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 19, flexShrink: 0 }}>{item.icon}</span>
          {open && <span>{item.label}</span>}
        </button>
      ))}

      {/* Divider */}
      <div
        style={{ margin: "8px 12px", height: 1, background: C.glassBorder }}
      />

      {/* Profile nav */}
      <button
        onClick={() => navigate("/profile")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: open ? "10px 16px" : "10px 0",
          justifyContent: open ? "flex-start" : "center",
          background: isActive("/profile")
            ? "rgba(124,58,237,.15)"
            : "transparent",
          border: "none",
          borderLeft: isActive("/profile")
            ? `3px solid ${C.violet}`
            : "3px solid transparent",
          color: isActive("/profile") ? "#c4b5fd" : C.textDim,
          cursor: "pointer",
          transition: "all .15s",
          width: "100%",
          marginBottom: 2,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <span style={{ fontSize: 19, flexShrink: 0 }}>◉</span>
        {open && <span>Profile</span>}
      </button>

      <div style={{ flex: 1 }} />

      {/* User strip */}
      {open && (
        <div
          onClick={() => navigate("/profile")}
          style={{
            margin: "0 12px 10px",
            padding: "10px 12px",
            borderRadius: 10,
            background: isActive("/profile") ? "rgba(124,58,237,.15)" : C.glass,
            border: isActive("/profile")
              ? "1px solid rgba(124,58,237,.4)"
              : `1px solid ${C.glassBorder}`,
            cursor: "pointer",
            transition: "all .18s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#fff",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials(user?.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  color: C.text,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.textDim,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            style={{
              width: "100%",
              marginTop: 8,
              padding: "5px",
              borderRadius: 7,
              background: "rgba(239,68,68,.1)",
              border: "1px solid rgba(239,68,68,.2)",
              color: C.red,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          margin: open ? "0 12px" : "0 8px",
          padding: "8px",
          borderRadius: 8,
          background: "rgba(255,255,255,.04)",
          border: `1px solid ${C.glassBorder}`,
          color: C.textDim,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        {open ? "◀" : "▶"}
      </button>
    </div>
  );
}
