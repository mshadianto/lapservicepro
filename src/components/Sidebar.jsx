import { fonts, colors } from "../styles/theme";

const NAV_ITEMS = [
  { key: "dashboard", icon: "\uD83D\uDCCA", label: "Dashboard" },
  { key: "orders", icon: "\uD83D\uDCCB", label: "Order Servis", showBadge: true },
  { key: "new", icon: "\u2795", label: "Servis Baru" },
  { key: "predict", icon: "\uD83E\uDD16", label: "Prediksi Kerusakan" },
  { key: "parts", icon: "\uD83D\uDD29", label: "Inventori Part" },
  { key: "technicians", icon: "\uD83D\uDC68\u200D\uD83D\uDD27", label: "Teknisi" },
  { key: "invoice", icon: "\uD83E\uDDFE", label: "Invoice" },
  { key: "report", icon: "\uD83D\uDCC8", label: "Laporan" },
];

export default function Sidebar({ active, setActive, pendingCount }) {
  return (
    <div style={{
      width: 250, minHeight: "100vh",
      background: "linear-gradient(195deg, #0f172a 0%, #1e293b 100%)",
      display: "flex", flexDirection: "column", flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            boxShadow: "0 4px 15px rgba(34,211,238,0.3)",
          }}>{"\uD83D\uDCBB"}</div>
          <div>
            <div style={{ color: colors.slate100, fontWeight: 800, fontSize: 15, fontFamily: fonts.heading, letterSpacing: "-0.02em" }}>LapServ Pro</div>
            <div style={{ color: colors.slate500, fontSize: 11, fontFamily: fonts.body }}>Service Management</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {NAV_ITEMS.map((it) => {
          const isActive = active === it.key;
          return (
            <div key={it.key} onClick={() => setActive(it.key)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 10, cursor: "pointer", marginBottom: 2, transition: "all 0.2s",
              background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
              borderLeft: isActive ? `3px solid ${colors.blue500}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>{it.icon}</span>
              <span style={{
                color: isActive ? "#e2e8f0" : colors.slate400, fontSize: 13.5,
                fontWeight: isActive ? 600 : 400, fontFamily: fonts.body,
              }}>{it.label}</span>
              {it.showBadge && pendingCount > 0 && (
                <span style={{
                  marginLeft: "auto", background: colors.red500, color: colors.white,
                  fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 10,
                  fontFamily: fonts.mono,
                }}>{pendingCount}</span>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{
        padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
        color: colors.slate600, fontSize: 10, fontFamily: fonts.body, textAlign: "center",
      }}>
        &copy; {new Date().getFullYear()} LapServ Pro v2.0
      </div>
    </div>
  );
}
