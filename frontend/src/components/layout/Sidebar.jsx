// src/components/layout/Sidebar.jsx
import { C, FONTS } from "../../styles/tokens";
import { NAV_ITEMS } from "../../data/constants";
import { initials } from "../../utils/helpers";

export default function Sidebar({
  active,
  setActive,
  open,
  setOpen,
  user,
  onLogout,
}) {
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
            flexShrink: 0,
            background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            boxShadow: "0 4px 12px rgba(124,58,237,.3)",
          }}
        >
          ✦
        </div>
        {open && (
          <span
            style={{
              fontFamily: FONTS.display,
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
      {NAV_ITEMS.filter((i) => i.id !== "profile").map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className="hov-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: open ? "10px 16px" : "10px 0",
            justifyContent: open ? "flex-start" : "center",
            background:
              active === item.id ? "rgba(124,58,237,.15)" : "transparent",
            border: "none",
            borderLeft:
              active === item.id
                ? `3px solid ${C.violet}`
                : "3px solid transparent",
            color: active === item.id ? "#c4b5fd" : C.textDim,
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

      {/* Divider before profile */}
      <div
        style={{ margin: "8px 12px", height: 1, background: C.glassBorder }}
      />

      <div style={{ flex: 1 }} />

      {/* User strip — click to go to profile */}
      {open && (
        <div
          onClick={() => setActive("profile")}
          style={{
            margin: "0 12px 10px",
            padding: "10px 12px",
            borderRadius: 10,
            background: active === "profile" ? "rgba(124,58,237,.15)" : C.glass,
            border:
              active === "profile"
                ? `1px solid rgba(124,58,237,.4)`
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
                flexShrink: 0,
                background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#fff",
                fontWeight: 700,
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
            onClick={onLogout}
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
        onClick={() => setOpen((o) => !o)}
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
