import { fonts } from "../styles/theme";

const SEVERITY_MAP = {
  critical: { bg: "#fef2f2", color: "#dc2626", label: "KRITIS", border: "#fecaca" },
  high: { bg: "#fff7ed", color: "#ea580c", label: "TINGGI", border: "#fed7aa" },
  medium: { bg: "#fffbeb", color: "#d97706", label: "SEDANG", border: "#fde68a" },
  low: { bg: "#f0fdf4", color: "#16a34a", label: "RINGAN", border: "#bbf7d0" },
};

export default function SeverityBadge({ severity }) {
  const c = SEVERITY_MAP[severity] || SEVERITY_MAP.low;
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, background: c.bg, color: c.color,
      fontSize: 10, fontWeight: 700, fontFamily: fonts.mono,
      border: `1px solid ${c.border}`, letterSpacing: "0.05em",
    }}>{c.label}</span>
  );
}
