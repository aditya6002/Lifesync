// src/shared/components/layout/Topbar.tsx
import { useNavigate } from "react-router-dom";
import type { User } from "../../../shared/types";
import { greeting, initials } from "../../utils/helpers";

const C = {
  violet: "#7C3AED",
  violetLight: "#a855f7",
  text: "#f1f5f9",
  textMid: "#94a3b8",
  glass: "rgba(255,255,255,.04)",
  glassBorder: "rgba(255,255,255,.08)",
};

interface TopbarProps {
  user: User | null;
}

export default function Topbar({ user }: TopbarProps) {
  const navigate = useNavigate();

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
      <div style={{ fontSize: 13, color: "#64748b" }}>
        {greeting()},{" "}
        <span style={{ color: "#c4b5fd", fontWeight: 500 }}>
          {user?.name?.split(" ")[0]} ✨
        </span>
      </div>

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
          onClick={() => navigate("/profile")}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(124,58,237,.5)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(124,58,237,.28)")
          }
        >
          {initials(user?.name)}
        </div>
      </div>
    </div>
  );
}
