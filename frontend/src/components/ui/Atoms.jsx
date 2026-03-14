// src/components/ui/Atoms.jsx
import { useEffect } from "react";
import { C } from "../../styles/tokens";

/* ── Glass card ─────────────────────────────────────────── */
export function Glass({ children, style = {}, className = "", onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: C.glass,
        border: `1px solid ${C.glassBorder}`,
        backdropFilter: "blur(16px)",
        borderRadius: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Button ─────────────────────────────────────────────── */
export function Btn({
  children,
  variant = "primary",
  onClick,
  style = {},
  small,
  disabled,
}) {
  const base = {
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 10,
    fontWeight: 600,
    transition: "all .15s",
    opacity: disabled ? 0.5 : 1,
    fontSize: small ? 11 : 13,
    padding: small ? "5px 12px" : "10px 22px",
    ...style,
  };
  const variants = {
    primary: {
      background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
      color: "#fff",
      boxShadow: "0 4px 16px rgba(124,58,237,.28)",
    },
    ghost: {
      background: C.glass,
      border: `1px solid ${C.glassBorder}`,
      color: C.textMid,
    },
    danger: {
      background: "rgba(239,68,68,.12)",
      border: "1px solid rgba(239,68,68,.25)",
      color: C.red,
    },
    ai: {
      background: "rgba(124,58,237,.18)",
      border: "1px solid rgba(124,58,237,.3)",
      color: "#c4b5fd",
    },
    outline: {
      background: "transparent",
      border: `1px solid ${C.glassBorder}`,
      color: C.textMid,
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}

/* ── Badge / chip ───────────────────────────────────────── */
export function Badge({ label, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 9px",
        borderRadius: 20,
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

/* ── Text Input ─────────────────────────────────────────── */
export function FInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: C.red }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "rgba(255,255,255,.05)",
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 10,
          padding: "10px 13px",
          color: C.text,
          fontSize: 13,
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}

/* ── Textarea ───────────────────────────────────────────── */
export function FTextarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: "rgba(255,255,255,.05)",
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 10,
          padding: "10px 13px",
          color: C.text,
          fontSize: 13,
          outline: "none",
          width: "100%",
          resize: "vertical",
          lineHeight: 1.65,
        }}
      />
    </div>
  );
}

/* ── Select ─────────────────────────────────────────────── */
export function FSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#111827",
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 10,
          padding: "10px 13px",
          color: C.text,
          fontSize: 13,
          outline: "none",
          width: "100%",
        }}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Toast notification ─────────────────────────────────── */
export function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2000,
        background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
        color: "#fff",
        padding: "11px 20px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 8px 28px rgba(124,58,237,.45)",
        animation: "fadeIn .3s ease",
      }}
    >
      {msg}
    </div>
  );
}
