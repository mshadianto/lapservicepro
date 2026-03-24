import { useState } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { PLANS } from "../data/subscription";
import { fonts, colors } from "../styles/theme";

export default function TierBar() {
  const { plan, setPlan } = useSubscription();
  const p = PLANS[plan];
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 16px", background: colors.white, borderRadius: 11, border: `1px solid ${colors.slate200}`, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <span style={{ fontSize: 16 }}>{p.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: p.color, fontFamily: fonts.body }}>{p.name}</span>
        <span style={{ padding: "2px 8px", borderRadius: 6, background: `${p.color}15`, color: p.color, fontSize: 10.5, fontWeight: 600, fontFamily: fonts.body }}>{p.priceLabel}</span>
        {plan === "starter" && <span style={{ fontSize: 10.5, color: colors.amber500, fontFamily: fonts.body, fontWeight: 500 }}>{"\u2022"} {p.maxOrders} order/bulan</span>}
      </div>
      <button onClick={() => setShowPicker(!showPicker)} style={{
        padding: "6px 14px", borderRadius: 7, border: `1px solid ${colors.slate200}`,
        background: colors.white, color: colors.blue500, fontSize: 11, fontWeight: 600,
        cursor: "pointer", fontFamily: fonts.body,
      }}>{plan === "enterprise" ? "Paket Aktif" : "Upgrade"}</button>

      {showPicker && (
        <div style={{
          position: "absolute", right: 0, top: 48, background: colors.white, borderRadius: 14,
          padding: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: `1px solid ${colors.slate200}`,
          zIndex: 100, width: 300,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, fontFamily: fonts.body }}>Pilih Paket</div>
          {Object.values(PLANS).map((pl) => (
            <div key={pl.id} onClick={() => { setPlan(pl.id); setShowPicker(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9,
              cursor: "pointer", marginBottom: 4,
              background: plan === pl.id ? `${pl.color}10` : colors.slate50,
              border: `1.5px solid ${plan === pl.id ? pl.color : "transparent"}`,
            }}>
              <span style={{ fontSize: 20 }}>{pl.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: pl.color, fontFamily: fonts.body }}>{pl.name}</div>
                <div style={{ fontSize: 10.5, color: colors.slate500 }}>
                  {pl.maxOrders >= 9999 ? "Unlimited" : pl.maxOrders} order {"\u2022"} {pl.maxUsers >= 999 ? "Unlimited" : pl.maxUsers} user
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: fonts.body }}>{pl.priceLabel}</span>
            </div>
          ))}
          <div style={{ fontSize: 9.5, color: colors.slate400, marginTop: 8, textAlign: "center" }}>(demo: klik untuk switch tier langsung)</div>
        </div>
      )}
    </div>
  );
}
