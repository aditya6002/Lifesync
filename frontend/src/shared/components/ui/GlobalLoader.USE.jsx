// src/shared/components/ui/GlobalLoader.usage.tsx
// ── USAGE EXAMPLES — do not import this file in production ──

/**
 * ═══════════════════════════════════════════════════════
 *  4 WAYS TO USE THE GLOBAL LOADER
 * ═══════════════════════════════════════════════════════
 *
 * 1. withLoader()  — wrap any async function (RECOMMENDED)
 * 2. show() / hide() — manual control
 * 3. InlineLoader  — inside buttons / table rows
 * 4. PageSkeleton  — while a page is fetching initial data
 */

import { useLoader, InlineLoader, PageSkeleton } from "./GlobalLoader";
import { useState } from "react";

// ─────────────────────────────────────────────────────────
// 1. withLoader — simplest, auto hides on success/error
// ─────────────────────────────────────────────────────────
export function Example_WithLoader() {
  const { withLoader } = useLoader();

  const handleSave = async () => {
    await withLoader(
      () => fetch("/api/expenses", { method: "POST" }),
      "Saving expense...", // ← message shown in overlay
    );
  };

  const handleDelete = async () => {
    await withLoader(
      () => fetch("/api/expenses/123", { method: "DELETE" }),
      "Deleting...",
    );
  };

  return <button onClick={handleSave}>Save</button>;
}

// ─────────────────────────────────────────────────────────
// 2. show() / hide() — manual, useful for multi-step flows
// ─────────────────────────────────────────────────────────
export function Example_Manual() {
  const { show, hide } = useLoader();

  const handleUpload = async () => {
    show("Uploading file...", "bar"); // show bar variant
    try {
      await uploadFile();
      show("Processing...", "spinner"); // change message mid-flow
      await processFile();
    } finally {
      hide(); // always hide in finally
    }
  };

  return <button onClick={handleUpload}>Upload</button>;
}

// ─────────────────────────────────────────────────────────
// 3. InlineLoader — inside a button while submitting
// ─────────────────────────────────────────────────────────
export function Example_InlineLoader() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await saveData();
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={saving}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 22px",
        borderRadius: 10,
        background: "#7C3AED",
        border: "none",
        color: "#fff",
        cursor: saving ? "not-allowed" : "pointer",
      }}
    >
      {saving ? (
        <>
          <InlineLoader size={14} color="#fff" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// 4. PageSkeleton — while page fetches initial data
// ─────────────────────────────────────────────────────────
export function Example_PageSkeleton() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // useEffect → fetch data → setLoading(false)

  if (loading) return <PageSkeleton />;
  return <div>Page content here</div>;
}

// ─────────────────────────────────────────────────────────
// 5. All 4 loader TYPES you can pass to show() / withLoader()
// ─────────────────────────────────────────────────────────
//
//  "dots"    — 3 bouncing dots   (DEFAULT, good for saves)
//  "spinner" — rotating ring     (good for loading data)
//  "bar"     — moving bar        (good for uploads/processing)
//  "pulse"   — pulsing ring      (good for AI operations)
//
//  Examples:
//    show("Saving...",     "dots")
//    show("Loading...",    "spinner")
//    show("Uploading...",  "bar")
//    show("AI thinking..","pulse")

async function saveData() {}
async function uploadFile() {}
async function processFile() {}
