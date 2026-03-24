import { useSubscription } from "../hooks/useSubscription";
import { PLANS } from "../data/subscription";
import { fonts, colors } from "../styles/theme";

const NAV_ITEMS = [
  { key: "dashboard", icon: "\uD83D\uDCCA", label: "Dashboard" },
  { key: "orders", icon: "\uD83D\uDCCB", label: "Order Servis", showBadge: true },
  { key: "new", icon: "\u2795", label: "Servis Baru" },
  { key: "predict", icon: "\uD83E\uDD16", label: "Prediksi AI" },
  { key: "parts", icon: "\uD83D\uDD29", label: "Inventori" },
  { key: "marketplace", icon: "\uD83D\uDED2", label: "Marketplace EK" },
  { key: "finance", icon: "\uD83D\uDCB0", label: "Keuangan", lockedOn: "starter" },
  { key: "technicians", icon: "\uD83D\uDC68\u200D\uD83D\uDD27", label: "Teknisi", lockedOn: "starter" },
  { key: "invoice", icon: "\uD83E\uDDFE", label: "Invoice" },
  { key: "report", icon: "\uD83D\uDCC8", label: "Laporan" },
];

export default function Sidebar({ active, setActive, pendingCount, mobileOpen, onClose }) {
  const { plan } = useSubscription();
  const p = PLANS[plan];

  return (
    <>
      {mobileOpen && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998, display: "none" }} className="sidebar-overlay" />
      )}

      <div className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`} style={{
        width: 250, minHeight: "100vh",
        background: "linear-gradient(195deg, #0f172a 0%, #1e293b 100%)",
        display: "flex", flexDirection: "column", flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)", zIndex: 999,
      }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `linear-gradient(135deg, ${p.color}, ${p.color}aa)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              boxShadow: `0 4px 15px ${p.color}44`,
            }}>{"\uD83D\uDCBB"}</div>
            <div>
              <div style={{ color: colors.slate100, fontWeight: 800, fontSize: 15, fontFamily: fonts.heading, letterSpacing: "-0.02em" }}>LapServ Pro</div>
              <div style={{ color: p.color, fontSize: 10, fontWeight: 600, fontFamily: fonts.body }}>{p.icon} {p.name}</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {NAV_ITEMS.map((it) => {
            const isActive = active === it.key;
            const isLocked = it.lockedOn === plan;
            return (
              <div key={it.key} onClick={() => { setActive(it.key); if (onClose) onClose(); }} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, cursor: "pointer", marginBottom: 2, transition: "all 0.2s",
                background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                borderLeft: isActive ? `3px solid ${colors.blue500}` : "3px solid transparent",
                opacity: isLocked ? 0.45 : 1,
              }}>
                <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>{it.icon}</span>
                <span style={{
                  color: isActive ? "#e2e8f0" : colors.slate400, fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400, fontFamily: fonts.body, flex: 1,
                }}>{it.label}</span>
                {isLocked && <span style={{ fontSize: 10 }}>{"\uD83D\uDD12"}</span>}
                {it.showBadge && pendingCount > 0 && (
                  <span style={{
                    background: colors.red500, color: colors.white,
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
          &copy; {new Date().getFullYear()} LapServ Pro {"\u00D7"} Enterkomputer
        </div>
      </div>
    </>
  );
}
