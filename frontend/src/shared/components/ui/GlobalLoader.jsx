import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";

// ── Design Tokens (embedded) ─────────────────────────────
const COLORS = {
  violet: "#7c3aed",
  violetLight: "#a78bfa",
  textMid: "#9ca3af",
  textLight: "#d1d5db",
  glass: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  bgDark: "rgba(17, 24, 39, 0.95)",
  backdropDark: "rgba(7, 9, 15, 0.72)",
};

const FONTS = {
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'Fira Code', 'Courier New', monospace",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
};

const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ── Global Keyframes (define once, reuse everywhere) ──────
const LOADER_KEYFRAMES = `
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
  @keyframes skeletonShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes inlineSpin {
    to { transform: rotate(360deg); }
  }
`;

// ── Context ───────────────────────────────────────────────
const LoaderContext = createContext(null);

// ── Provider ──────────────────────────────────────────────
export function LoaderProvider({ children }) {
  const [state, setState] = useState({
    visible: false,
    message: "Loading...",
    type: "dots",
  });

  const show = useCallback((message = "Loading...", type) => {
    console.log("st");
    setState({ visible: true, message, type });
  }, []);

  const hide = useCallback(() => {
    console.log("done");
    setState((s) => ({ ...s, visible: false }));
  }, []);

  const withLoader = useCallback(
    async (fn, message = "Loading...") => {
      show(message);
      try {
        const result = await fn();
        return result;
      } finally {
        hide();
      }
    },
    [show, hide],
  );

  return (
    <LoaderContext.Provider value={{ show, hide, withLoader }}>
      {children}
      {state.visible && (
        <GlobalLoader message={state.message} type={state.type} />
      )}
    </LoaderContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────
export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx)
    throw new Error("🔴 useLoader must be used inside <LoaderProvider>");
  return ctx;
}

// ── Loader Variants (memoized) ──────────────────────────

const DotsLoader = memo(() => (
  <div style={{ display: "flex", gap: SPACING.sm, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: RADIUS.full,
          background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.violetLight})`,
          animation: `loaderBounce .9s ${i * 0.18}s ease-in-out infinite`,
        }}
      />
    ))}
  </div>
));
DotsLoader.displayName = "DotsLoader";

const SpinnerLoader = memo(() => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: RADIUS.full,
      border: `3px solid rgba(124, 58, 237, 0.2)`,
      borderTopColor: COLORS.violet,
      animation: "loaderSpin .75s linear infinite",
    }}
  />
));
SpinnerLoader.displayName = "SpinnerLoader";

const BarLoader = memo(() => (
  <div
    style={{
      width: 180,
      height: 4,
      borderRadius: RADIUS.sm,
      background: "rgba(124, 58, 237, 0.2)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: "45%",
        borderRadius: RADIUS.sm,
        background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.violetLight})`,
        animation: "loaderBar 1.2s ease-in-out infinite",
      }}
    />
  </div>
));
BarLoader.displayName = "BarLoader";

const PulseLoader = memo(() => (
  <div style={{ position: "relative", width: 48, height: 48 }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: RADIUS.full,
        border: `2px solid ${COLORS.violet}`,
        animation: "loaderPulse 1.4s ease-out infinite",
        opacity: 0,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: "30%",
        borderRadius: RADIUS.full,
        background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.violetLight})`,
        boxShadow: `0 0 16px rgba(124, 58, 237, 0.6)`,
      }}
    />
  </div>
));
PulseLoader.displayName = "PulseLoader";

// ── Main Loader Overlay (memoized) ──────────────────────

const GlobalLoader = memo(({ message, type }) => {
  const renderVariant = useMemo(() => {
    switch (type) {
      case "spinner":
        return <SpinnerLoader />;
      case "bar":
        return <BarLoader />;
      case "pulse":
        return <PulseLoader />;
      default:
        return <DotsLoader />;
    }
  }, [type]);

  return (
    <>
      <style>{LOADER_KEYFRAMES}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9000,
          background: COLORS.backdropDark,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "loaderFadeIn .2s ease",
        }}
      >
        <div
          style={{
            background: COLORS.bgDark,
            border: `1px solid rgba(124, 58, 237, 0.35)`,
            borderRadius: RADIUS.xl,
            padding: `${SPACING.xxl}px ${SPACING.xxl + 12}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: SPACING.lg,
            boxShadow:
              "0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124, 58, 237, 0.1)",
            animation: "loaderCardIn .25s ease",
            minWidth: 200,
            contain: "layout style paint",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: RADIUS.md,
              background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.violetLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: `0 8px 24px rgba(124, 58, 237, 0.4)`,
              flexShrink: 0,
            }}
          >
            ✦
          </div>

          {renderVariant}

          <div
            style={{
              fontSize: 13,
              color: COLORS.textMid,
              fontWeight: 500,
              fontFamily: FONTS.body,
              textAlign: "center",
              maxWidth: 200,
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        </div>
      </div>
    </>
  );
});
GlobalLoader.displayName = "GlobalLoader";

// ── Inline mini loader ──────────────────────────────────

export const InlineLoader = memo(({ size = 16, color = COLORS.violet }) => (
  <>
    <style>{LOADER_KEYFRAMES}</style>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.full,
        border: `2px solid ${color}33`,
        borderTopColor: color,
        display: "inline-block",
        animation: "inlineSpin .65s linear infinite",
        flexShrink: 0,
      }}
    />
  </>
));
InlineLoader.displayName = "InlineLoader";

// ── Skeleton Component ──────────────────────────────────

export const Skeleton = memo(
  ({ width = "100%", height = 16, borderRadius = 8, style = {} }) => (
    <div
      style={{
        width,
        height,
        borderRadius,
        background:
          "linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.09) 50%, rgba(255, 255, 255, 0.04) 75%)",
        backgroundSize: "800px 100%",
        animation: "skeletonShimmer 1.6s linear infinite",
        ...style,
      }}
    />
  ),
);
Skeleton.displayName = "Skeleton";

// ── Page Skeleton Preset ────────────────────────────────
export const PageSkeleton = memo(() => (
  <>
    <style>{LOADER_KEYFRAMES}</style>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: SPACING.lg,
        padding: SPACING.lg,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton width={180} height={28} borderRadius={RADIUS.lg} />
        <Skeleton width={110} height={36} borderRadius={RADIUS.lg} />
      </div>

      {/* Stat cards - responsive */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: SPACING.md,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              padding: SPACING.xl,
              borderRadius: RADIUS.xl,
              border: `1px solid ${COLORS.glassBorder}`,
              background: COLORS.glass,
            }}
          >
            <Skeleton
              width={32}
              height={32}
              borderRadius={RADIUS.lg}
              style={{ marginBottom: SPACING.md }}
            />
            <Skeleton
              width="70%"
              height={22}
              borderRadius={RADIUS.sm}
              style={{ marginBottom: SPACING.sm }}
            />
            <Skeleton width="50%" height={13} borderRadius={RADIUS.sm} />
          </div>
        ))}
      </div>

      {/* Content cards - responsive */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: SPACING.lg,
        }}
      >
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              padding: SPACING.xl,
              borderRadius: RADIUS.xl,
              border: `1px solid ${COLORS.glassBorder}`,
              background: COLORS.glass,
            }}
          >
            <Skeleton
              width="60%"
              height={16}
              borderRadius={RADIUS.sm}
              style={{ marginBottom: SPACING.lg }}
            />
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  gap: SPACING.md,
                  marginBottom: SPACING.md,
                  alignItems: "center",
                }}
              >
                <Skeleton
                  width={36}
                  height={36}
                  borderRadius={RADIUS.lg}
                  style={{ flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Skeleton
                    width="80%"
                    height={13}
                    borderRadius={RADIUS.sm}
                    style={{ marginBottom: SPACING.sm }}
                  />
                  <Skeleton width="50%" height={10} borderRadius={RADIUS.sm} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </>
));
PageSkeleton.displayName = "PageSkeleton";

// ── Export everything ───────────────────────────────────
export { COLORS, FONTS, SPACING, RADIUS };
