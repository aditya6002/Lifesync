// src/features/subscription/components/ProGate.tsx
import { ReactNode, useState } from "react";
import { useNavigate }         from "react-router-dom";
import { C, FONTS }            from "../../../shared/styles/tokens";
import { Glass, Btn }          from "../../../shared/components/ui/Atoms";
import { useSubscription, PlanId, PLANS } from "../subscription.context";

// ── Inline lock badge (small) ─────────────────────────────
export function LockBadge({ plan = "pro" }) {
  const cfg = PLANS[plan];
  return (
    <span style={{
      fontSize: 10, padding: "2px 7px", borderRadius: 20,
      background: cfg.color + "20", color: cfg.color,
      border: `1px solid ${cfg.color}40`, fontWeight: 700,
      marginLeft: 6, verticalAlign: "middle",
    }}>
      🔒 {cfg.badge}
    </span>
  );
}

// ── Upgrade nudge bar (inline, inside a card) ─────────────
export function UpgradeBar({ message, requiredPlan = "pro" }) {
  const nav = useNavigate();
  const cfg = PLANS[requiredPlan];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 14px", borderRadius: 10,
      background: cfg.color + "12",
      border: `1px solid ${cfg.color}30`,
      marginTop: 10,
    }}>
      <span style={{ fontSize: 18 }}>🔒</span>
      <div style={{ flex: 1, fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>{message}</div>
      <Btn small onClick={() => nav("/subscription")}
        style={{ background: `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`, flexShrink: 0 }}>
        Upgrade
      </Btn>
    </div>
  );
}

// ── Full gate overlay (blocks a section) ─────────────────
export function ProGate({ feature, description, requiredPlan = "pro", children }: ProGateProps) {
  const { can }  = useSubscription();
  const nav      = useNavigate();
  const cfg      = PLANS[requiredPlan];

  // If user has access — render children normally
  if (can(feature)) return <>{children}</>;

  // Blur + lock overlay
  return (
    <div style={{ position: "relative" }}>
      {/* Blurred preview */}
      <div style={{ filter: "blur(4px)", opacity: 0.4, pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(7,9,15,.5)", borderRadius: 16, backdropFilter: "blur(2px)",
      }}>
        <Glass style={{
          padding: "24px 28px", textAlign: "center",
          border: `1px solid ${cfg.color}40`,
          background: `linear-gradient(135deg,rgba(7,9,15,.95),rgba(17,24,39,.95))`,
          maxWidth: 280,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, color: C.text, fontWeight: 700, marginBottom: 8 }}>
            {feature} locked
          </div>
          <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 18 }}>
            {description ?? `Upgrade to ${cfg.name} to unlock ${feature}.`}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: cfg.color + "20", border: `1px solid ${cfg.color}40`, fontSize: 11, color: cfg.color, fontWeight: 600, marginBottom: 14 }}>
            {cfg.badge} plan required
          </div>
          <div>
            <Btn onClick={() => nav("/subscription")} style={{ background: `linear-gradient(135deg,${cfg.color},${cfg.color}bb)` }}>
              Upgrade to {cfg.name} →
            </Btn>
          </div>
        </Glass>
      </div>
    </div>
  );
}

// ── Usage limit bar ───────────────────────────────────────
export function UsageBar({
  label, used, max, color = C.violet,
}) {
  const pct   = max === -1 ? 0 : Math.min(100, (used / max) * 100);
  const isMax = max === -1;
  const near  = !isMax && pct >= 80;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: C.textMid }}>{label}</span>
        <span style={{ fontSize: 11, color: near ? C.yellow : C.textDim }}>
          {isMax ? "Unlimited" : `${used} / ${max}`}
        </span>
      </div>
      {!isMax && (
        <div style={{ height: 5, background: "rgba(255,255,255,.07)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 4, transition: "width .5s",
            background: near ? `linear-gradient(90deg,${C.yellow},${C.orange})` : `linear-gradient(90deg,${color},${color}bb)`,
          }} />
        </div>
      )}
    </div>
  );
}
