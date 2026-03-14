// src/components/ui/Modal.jsx
import { C } from "../../styles/tokens";
import { Btn } from "./Atoms";

/* ── Generic Modal ──────────────────────────────────────── */
export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.78)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-in"
        style={{
          width: "100%",
          maxWidth: wide ? 640 : 460,
          background: C.bg3,
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.glassBorder}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 17,
              color: C.text,
              fontWeight: 700,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.06)",
              border: "none",
              color: C.textMid,
              width: 30,
              height: 30,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── View Modal (with Edit / Delete footer) ─────────────── */
export function ViewModal({ title, onClose, onEdit, onDelete, children }) {
  return (
    <Modal title={title} onClose={onClose} wide>
      {children}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${C.glassBorder}`,
        }}
      >
        <Btn onClick={onEdit}>✏️ Edit</Btn>
        <Btn variant="ghost" onClick={onClose}>
          Close
        </Btn>
        <div style={{ flex: 1 }} />
        <Btn variant="danger" onClick={onDelete}>
          🗑 Delete
        </Btn>
      </div>
    </Modal>
  );
}

/* ── Confirm Dialog ─────────────────────────────────────── */
export function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.82)",
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
          background: C.bg3,
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 20,
        }}
      >
        <div
          style={{
            fontSize: 15,
            color: C.text,
            marginBottom: 20,
            lineHeight: 1.65,
          }}
        >
          {message}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="danger" onClick={onConfirm}>
            Yes, Delete
          </Btn>
          <Btn variant="ghost" onClick={onCancel}>
            Cancel
          </Btn>
        </div>
      </div>
    </div>
  );
}
