// src/shared/components/ui/Atoms.jsx
import { useEffect } from "react";
import { C } from "../../styles/tokens";

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

export function Btn({
  children,
  variant = "primary",
  onClick,
  style = {},
  small,
  disabled,
}) {
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
      style={{
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 10,
        fontWeight: 600,
        transition: "all .15s",
        opacity: disabled ? 0.5 : 1,
        fontSize: small ? 11 : 13,
        padding: small ? "5px 12px" : "10px 22px",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

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
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lbl = typeof o === "string" ? o : o.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, [onDone]);
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

export function InlineLoader({ size = 16, color = "#7C3AED" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}33`,
        borderTopColor: color,
        display: "inline-block",
        animation: "inlineSpin .65s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

export function Toggle({ on, onToggle }) {
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
        flexShrink: 0,
        background: on
          ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
          : "rgba(255,255,255,.08)",
        cursor: "pointer",
        position: "relative",
        transition: "background .22s",
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
          transition: "left .22s",
          boxShadow: "0 2px 6px rgba(0,0,0,.3)",
        }}
      />
    </div>
  );
}
