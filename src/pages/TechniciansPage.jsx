import { TECHNICIANS } from "../data/constants";
import { fonts, colors, pageTitle, pageSubtitle } from "../styles/theme";

export default function TechniciansPage() {
  return (
    <div>
      <h1 style={pageTitle}>Tim Teknisi</h1>
      <p style={{ ...pageSubtitle, margin: "0 0 24px" }}>Manajemen teknisi dan performa</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {TECHNICIANS.map((t) => (
          <div key={t.id} style={{
            background: colors.white, borderRadius: 14, padding: 24,
            border: `1px solid ${colors.slate200}`, textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 14px",
              background: `linear-gradient(135deg, ${colors.blue500}, ${colors.cyan400})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, color: colors.white, boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
            }}>{"\uD83D\uDC68\u200D\uD83D\uDD27"}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>{t.name}</div>
            <div style={{ fontSize: 12.5, color: colors.slate500, fontFamily: fonts.body, marginTop: 4 }}>{t.specialty}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, padding: "14px 0", borderTop: `1px solid ${colors.slate100}` }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: colors.amber500, fontFamily: fonts.heading }}>{"\u2B50"} {t.rating}</div>
                <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.body }}>Rating</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: colors.blue500, fontFamily: fonts.heading }}>{t.jobs}</div>
                <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.body }}>Jobs</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
