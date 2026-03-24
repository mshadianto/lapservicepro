import { fonts, colors } from "../styles/theme";

export default function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: colors.white, borderRadius: 14, padding: "20px 22px", flex: "1 1 200px",
      border: `1px solid ${colors.slate200}`, position: "relative", overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        position: "absolute", top: -10, right: -10, width: 70, height: 70,
        borderRadius: "50%", background: bg, opacity: 0.4,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, background: bg,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{icon}</div>
        <div>
          <div style={{ color: colors.slate500, fontSize: 11.5, fontFamily: fonts.body, marginBottom: 2 }}>{label}</div>
          <div style={{ color: colors.slate900, fontSize: 22, fontWeight: 800, fontFamily: fonts.heading, letterSpacing: "-0.03em" }}>{value}</div>
          {sub && <div style={{ color, fontSize: 11, fontFamily: fonts.body, marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}
