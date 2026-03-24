import { fonts } from "../styles/theme";
import { STATUS_CONFIG } from "../data/constants";

export default function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.antrian;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px",
      borderRadius: 8, background: c.bg, color: c.color, fontSize: 11.5,
      fontWeight: 600, fontFamily: fonts.body, border: `1px solid ${c.color}22`,
    }}>
      <span style={{ fontSize: 12 }}>{c.icon}</span>{c.label}
    </span>
  );
}
