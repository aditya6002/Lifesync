// src/features/activity/pages/ActivityPage.tsx
// (Used inside ProfilePage — not a standalone route)
import { C } from "../../../shared/styles/tokens";
import { Glass } from "../../../shared/components/ui/Atoms";
import { useActivity } from "../activity.context";
import { useHeatmap } from "../hook/useHeatmap";
import { timeAgo } from "../../../shared/utils/helpers";

const HEATMAP_COLS = [
  "rgba(255,255,255,0.05)",
  "rgba(124,58,237,0.2)",
  "rgba(124,58,237,0.42)",
  "rgba(124,58,237,0.65)",
  "rgba(124,58,237,0.88)",
];

const MODULE_ICONS = {
  expenses: "🍜",
  journal: "✦",
  notes: "◇",
  tasks: "✅",
  ai: "⟡",
};

export default function ActivityPage() {
  const { heatmap, recentLogs, loadingHeatmap, loadingRecent } = useActivity();
  const { tooltip, onHover, onLeave, onClick, cells } = useHeatmap(heatmap);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Heatmap */}
      <Glass style={{ padding: 20 }}>
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
          Activity — Last 70 Days
        </div>
        {loadingHeatmap ? (
          <div style={{ fontSize: 12, color: C.textDim }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {cells.map((cell) => (
                <div
                  key={cell.date}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: HEATMAP_COLS[cell.level],
                    cursor: "pointer",
                    transition: "transform .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.4)";
                    onHover(cell);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    onLeave();
                  }}
                  onClick={() => onClick(cell)}
                />
              ))}
            </div>

            {/* Tooltip */}
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
                    background: HEATMAP_COLS[tooltip.level],
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
                  onClick={() => onLeave()}
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
              <span style={{ fontSize: 10, color: C.textDim }}>More</span>
              <span style={{ fontSize: 10, color: C.textDim, marginLeft: 8 }}>
                · Click any cell for details
              </span>
            </div>
          </>
        )}
      </Glass>

      {/* Recent Activity feed */}
      <Glass style={{ padding: 20 }}>
        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
          Recent Activity
        </div>
        {loadingRecent ? (
          <div style={{ fontSize: 12, color: C.textDim }}>Loading...</div>
        ) : recentLogs.length === 0 ? (
          <div
            style={{
              fontSize: 13,
              color: C.textDim,
              textAlign: "center",
              padding: 20,
            }}
          >
            No activity yet. Start using the app
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentLogs.map((log, i) => (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom:
                    i < recentLogs.length - 1
                      ? `1px solid ${C.glassBorder}`
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(124,58,237,.15)",
                    border: "1px solid rgba(124,58,237,.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    flexShrink: 0,
                  }}
                >
                  {MODULE_ICONS[log.module] ?? "●"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.text }}>
                    <span style={{ textTransform: "capitalize" }}>
                      {log.action}
                    </span>{" "}
                    {log.module}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                    {timeAgo(log.createdAt)}
                  </div>
                </div>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.violet,
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Glass>
    </div>
  );
}
