export const fonts = {
  heading: "'Outfit', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

export const colors = {
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  blue600: "#2563eb",
  blue500: "#3b82f6",
  blue50: "#eff6ff",
  cyan400: "#22d3ee",
  green500: "#10b981",
  green50: "#ecfdf5",
  amber500: "#f59e0b",
  amber50: "#fffbeb",
  red500: "#ef4444",
  red50: "#fef2f2",
  violet500: "#8b5cf6",
  violet50: "#f5f3ff",
  white: "#fff",
};

export const pageTitle = {
  fontSize: 26,
  fontWeight: 800,
  color: colors.slate900,
  fontFamily: fonts.heading,
  margin: 0,
  letterSpacing: "-0.03em",
};

export const pageSubtitle = {
  color: colors.slate500,
  fontSize: 13,
  fontFamily: fonts.body,
  margin: "4px 0 0",
};

export const card = {
  background: colors.white,
  borderRadius: 14,
  border: `1px solid ${colors.slate200}`,
};

export const inputBase = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 9,
  border: `1px solid ${colors.slate200}`,
  fontSize: 13,
  fontFamily: fonts.body,
  outline: "none",
  background: colors.slate50,
  boxSizing: "border-box",
};

export const labelBase = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: colors.slate700,
  marginBottom: 6,
  fontFamily: fonts.body,
};

export const primaryButton = {
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: `linear-gradient(135deg, ${colors.blue500}, ${colors.blue600})`,
  color: colors.white,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: fonts.body,
  boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
};

export const filterButton = (isActive) => ({
  padding: "7px 14px",
  borderRadius: 8,
  border: `1px solid ${isActive ? colors.blue500 : colors.slate200}`,
  background: isActive ? colors.blue50 : colors.white,
  color: isActive ? colors.blue500 : colors.slate500,
  fontSize: 11.5,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: fonts.body,
});
