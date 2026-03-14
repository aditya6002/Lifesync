// src/shared/components/ui/GlobalLoader.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { C, FONTS } from "../../styles/tokens";

// ── Types ─────────────────────────────────────────────────
interface LoaderState {
  visible: boolean;
  message: string;
  type:    "spinner" | "dots" | "bar" | "pulse";
}

interface LoaderContextType {
  show:  (message?: string, type?: LoaderState["type"]) => void;
  hide:  () => void;
  withLoader: <T>(fn: () => Promise<T>, message?: string) => Promise<T>;
}

// ── Context ───────────────────────────────────────────────
const LoaderContext = createContext<LoaderContextType | null>(null);

// ── Provider ──────────────────────────────────────────────
export function LoaderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoaderState>({
    visible: false,
    message: "Loading...",
    type:    "dots",
  });

  const show = useCallback((message = "Loading...", type: LoaderState["type"] = "dots") => {
    setState({ visible: true, message, type });
  }, []);

  const hide = useCallback(() => {
    setState(s => ({ ...s, visible: false }));
  }, []);

  // Wrap any async function — auto show/hide loader
  const withLoader = useCallback(async <T>(
    fn: () => Promise<T>,
    message = "Loading..."
  ): Promise<T> => {
    show(message);
    try {
      const result = await fn();
      return result;
    } finally {
      hide();
    }
  }, [show, hide]);

  return (
    <LoaderContext.Provider value={{ show, hide, withLoader }}>
      {children}
      {state.visible && <GlobalLoader message={state.message} type={state.type} />}
    </LoaderContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────
export function useLoader(): LoaderContextType {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be inside LoaderProvider");
  return ctx;
}

// ── Loader variants ───────────────────────────────────────
function DotsLoader() {
  return (
    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 10, height: 10, borderRadius: "50%",
            background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
            animation: `loaderBounce .9s ${i * 0.18}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function SpinnerLoader() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      border: `3px solid rgba(124,58,237,.2)`,
      borderTopColor: C.violet,
      animation: "loaderSpin .75s linear infinite",
    }} />
  );
}

function BarLoader() {
  return (
    <div style={{ width: 180, height: 4, borderRadius: 4, background: "rgba(124,58,237,.2)", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: "45%", borderRadius: 4,
        background: `linear-gradient(90deg,${C.violet},${C.violetLight})`,
        animation: "loaderBar 1.2s ease-in-out infinite",
      }} />
    </div>
  );
}

function PulseLoader() {
  return (
    <div style={{ position: "relative", width: 48, height: 48 }}>
      {/* Outer ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `2px solid ${C.violet}`,
        animation: "loaderPulse 1.4s ease-out infinite",
        opacity: 0,
      }} />
      {/* Inner dot */}
      <div style={{
        position: "absolute", inset: "30%", borderRadius: "50%",
        background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
        boxShadow: `0 0 16px rgba(124,58,237,.6)`,
      }} />
    </div>
  );
}

// ── Main Loader Overlay ───────────────────────────────────
interface GlobalLoaderProps {
  message: string;
  type:    LoaderState["type"];
}

function GlobalLoader({ message, type }: GlobalLoaderProps) {
  const renderVariant = () => {
    switch (type) {
      case "spinner": return <SpinnerLoader />;
      case "bar":     return <BarLoader />;
      case "pulse":   return <PulseLoader />;
      default:        return <DotsLoader />;
    }
  };

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes loaderBounce {
          0%, 60%, 100% { transform: translateY(0);    opacity: 1;   }
          30%            { transform: translateY(-10px); opacity: .7; }
        }
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes loaderBar {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%);  }
          100% { transform: translateX(300%);  }
        }
        @keyframes loaderPulse {
          0%   { transform: scale(.6);  opacity: .8; }
          100% { transform: scale(2.2); opacity: 0;  }
        }
        @keyframes loaderFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes loaderCardIn {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>

      {/* Backdrop */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(7,9,15,.72)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "loaderFadeIn .2s ease",
      }}>
        {/* Card */}
        <div style={{
          background: "rgba(17,24,39,.95)",
          border: `1px solid rgba(124,58,237,.35)`,
          borderRadius: 20,
          padding: "32px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          boxShadow: "0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(124,58,237,.1)",
          animation: "loaderCardIn .25s ease",
          minWidth: 200,
        }}>
          {/* Logo mark */}
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 8px 24px rgba(124,58,237,.4)",
          }}>✦</div>

          {/* Variant */}
          {renderVariant()}

          {/* Message */}
          <div style={{
            fontSize: 13, color: C.textMid, fontWeight: 500,
            fontFamily: FONTS.body, textAlign: "center",
            maxWidth: 200, lineHeight: 1.5,
          }}>
            {message}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Inline mini loader (for buttons, sections) ────────────
interface InlineLoaderProps {
  size?:    number;
  color?:   string;
}
export function InlineLoader({ size = 16, color = C.violet }: InlineLoaderProps) {
  return (
    <>
      <style>{`
        @keyframes inlineSpin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: `2px solid ${color}33`,
        borderTopColor: color,
        display: "inline-block",
        animation: "inlineSpin .65s linear infinite",
        flexShrink: 0,
      }} />
    </>
  );
}

// ── Page-level skeleton loader ────────────────────────────
interface SkeletonProps {
  width?:        number | string;
  height?:       number;
  borderRadius?: number;
  style?:        React.CSSProperties;
}
export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style = {} }: SkeletonProps) {
  return (
    <>
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
      `}</style>
      <div style={{
        width, height, borderRadius,
        background: "linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.09) 50%, rgba(255,255,255,.04) 75%)",
        backgroundSize: "800px 100%",
        animation: "skeletonShimmer 1.6s linear infinite",
        ...style,
      }} />
    </>
  );
}

// ── Page skeleton preset (for initial page loads) ─────────
export function PageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 4 }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width={180} height={28} borderRadius={10} />
        <Skeleton width={110} height={36} borderRadius={10} />
      </div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(178px,1fr))", gap: 12 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ padding: 18, borderRadius: 16, border: `1px solid ${C.glassBorder}`, background: C.glass }}>
            <Skeleton width={32} height={32} borderRadius={10} style={{ marginBottom: 12 }} />
            <Skeleton width="70%" height={22} borderRadius={8} style={{ marginBottom: 8 }} />
            <Skeleton width="50%" height={13} borderRadius={6} />
          </div>
        ))}
      </div>
      {/* Content cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[1,2].map(i => (
          <div key={i} style={{ padding: 20, borderRadius: 16, border: `1px solid ${C.glassBorder}`, background: C.glass }}>
            <Skeleton width="60%" height={16} borderRadius={6} style={{ marginBottom: 16 }} />
            {[1,2,3].map(j => (
              <div key={j} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                <Skeleton width={36} height={36} borderRadius={10} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="80%" height={13} borderRadius={5} style={{ marginBottom: 6 }} />
                  <Skeleton width="50%" height={10} borderRadius={5} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
