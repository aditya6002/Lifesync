// src/components/layout/Topbar.jsx
import { C } from "../../styles/tokens";
import { greeting, initials } from "../../utils/helpers";

export default function Topbar({ user, setActive }) {
  return (
    <div
      style={{
        height: 56,
        borderBottom: `1px solid ${C.glassBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        background: "rgba(7,9,15,.95)",
        flexShrink: 0,
      }}
    >
      {/* Greeting */}
      <div style={{ fontSize: 13, color: C.textDim }}>
        {greeting()},{" "}
        <span style={{ color: "#c4b5fd", fontWeight: 500 }}>
          {user?.name?.split(" ")[0]} ✨
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>

        <button
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: C.glass,
            border: `1px solid ${C.glassBorder}`,
            color: C.textMid,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          🔔
        </button>

        <div
          onClick={() => setActive?.("profile")}
          title="View Profile"
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "rgba(124,58,237,.28)",
            border: `2px solid ${C.violet}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            cursor: "pointer",
            color: "#c4b5fd",
            fontWeight: 700,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(124,58,237,.28)";
          }}
        >
          {initials(user?.name)}
        </div>
      </div>
    </div>
  );
}
