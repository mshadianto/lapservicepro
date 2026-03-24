import { useState } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { PLANS, FEATURE_NAMES } from "../data/subscription";
import { fonts, colors } from "../styles/theme";

function PaywallOverlay({ feature, requiredPlan, onClose }) {
  const { setPlan } = useSubscription();
  const rp = PLANS[requiredPlan];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
      <div style={{ background: colors.white, borderRadius: 18, padding: "32px 36px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{"\uD83D\uDD12"}</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.slate900, fontFamily: fonts.heading, margin: "0 0 6px" }}>Fitur Premium</h2>
        <p style={{ color: colors.slate500, fontSize: 13, fontFamily: fonts.body, margin: "0 0 16px" }}>
          <strong>{FEATURE_NAMES[feature] || feature}</strong> tersedia mulai paket{" "}
          <span style={{ color: rp.color, fontWeight: 700 }}>{rp.name}</span>
        </p>
        <div style={{ background: colors.slate50, borderRadius: 12, padding: "16px 20px", marginBottom: 20, border: `1px solid ${colors.slate200}`, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: rp.color, fontFamily: fonts.body }}>{rp.icon} {rp.name}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: colors.slate900, fontFamily: fonts.heading }}>{rp.priceLabel}</span>
          </div>
          {rp.features.filter((f) => !PLANS.starter.features.includes(f)).slice(0, 6).map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0", fontSize: 11.5, color: colors.slate600, fontFamily: fonts.body }}>
              <span style={{ color: rp.color }}>{"\u2713"}</span>{FEATURE_NAMES[f] || f}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 9, border: `1px solid ${colors.slate200}`, background: colors.white, color: colors.slate500, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: fonts.body }}>Nanti</button>
          <button onClick={() => { setPlan(requiredPlan); onClose(); }} style={{
            flex: 2, padding: 10, borderRadius: 9, border: "none",
            background: `linear-gradient(135deg, ${rp.color}, ${rp.color}dd)`,
            color: colors.white, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fonts.body,
            boxShadow: `0 4px 14px ${rp.color}44`,
          }}>Upgrade ke {rp.name}</button>
        </div>
      </div>
    </div>
  );
}

export default function LockedSection({ feature, requiredPlan = "pro", children, blurAmount = 6 }) {
  const { plan } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const currentPlan = PLANS[plan];
  const isLocked = currentPlan.locked.includes(feature);

  if (!isLocked) return children;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: `blur(${blurAmount}px)`, pointerEvents: "none", userSelect: "none" }}>{children}</div>
      <div onClick={() => setShowPaywall(true)} style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", cursor: "pointer",
        background: "rgba(255,255,255,0.4)", borderRadius: 12,
      }}>
        <div style={{ background: colors.white, borderRadius: 14, padding: "20px 28px", textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", border: `1px solid ${colors.slate200}` }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{"\uD83D\uDD12"}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.slate900, fontFamily: fonts.body }}>{FEATURE_NAMES[feature] || feature}</div>
          <div style={{ fontSize: 11, color: colors.slate500, fontFamily: fonts.body, marginTop: 2 }}>
            Upgrade ke <span style={{ color: PLANS[requiredPlan].color, fontWeight: 600 }}>{PLANS[requiredPlan].name}</span>
          </div>
        </div>
      </div>
      {showPaywall && <PaywallOverlay feature={feature} requiredPlan={requiredPlan} onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
