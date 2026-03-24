import { useState } from "react";
import SeverityBadge from "../components/SeverityBadge";
import { DAMAGE_PREDICTIONS, PARTS_CATALOG } from "../data/constants";
import { fmt } from "../utils/format";
import { fonts, colors, pageTitle, pageSubtitle } from "../styles/theme";

export default function PredictPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1 style={pageTitle}>Prediksi Kerusakan</h1>
      <p style={{ ...pageSubtitle, margin: "0 0 24px" }}>Diagnosa AI berdasarkan gejala/keluhan laptop</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {Object.entries(DAMAGE_PREDICTIONS).map(([name, data]) => (
          <div key={name} onClick={() => setSelected(selected === name ? null : name)} style={{
            background: selected === name ? colors.slate50 : colors.white,
            borderRadius: 12, padding: "16px 18px",
            border: `2px solid ${selected === name ? colors.blue500 : colors.slate200}`,
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.slate900, fontFamily: fonts.body }}>{name}</span>
              <SeverityBadge severity={data.severity} />
            </div>
          </div>
        ))}
      </div>

      {selected && (() => {
        const data = DAMAGE_PREDICTIONS[selected];
        return (
          <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.slate200}`, overflow: "hidden" }}>
            <div style={{ background: `linear-gradient(135deg, ${colors.slate800}, ${colors.slate700})`, padding: "22px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{"\uD83E\uDD16"}</span>
                <div>
                  <h3 style={{ margin: 0, color: colors.slate50, fontSize: 18, fontWeight: 800, fontFamily: fonts.heading }}>Analisis: {selected}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <SeverityBadge severity={data.severity} />
                    <span style={{ color: colors.slate400, fontSize: 12, fontFamily: fonts.body }}>Estimasi biaya: {fmt(data.estCost[0])} — {fmt(data.estCost[1])}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 26 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: colors.slate900, fontFamily: fonts.body }}>{"\uD83D\uDD0D"} Kemungkinan Penyebab</h4>
                  {data.possible.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${colors.slate100}` }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: colors.white,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 13, color: colors.slate700, fontFamily: fonts.body }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: colors.slate900, fontFamily: fonts.body }}>{"\uD83D\uDD29"} Part yang Mungkin Dibutuhkan</h4>
                  {data.parts.map((pid) => {
                    const part = PARTS_CATALOG.find((x) => x.id === pid);
                    return part ? (
                      <div key={pid} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.slate100}` }}>
                        <div>
                          <div style={{ fontSize: 13, color: colors.slate700, fontWeight: 500, fontFamily: fonts.body }}>{part.name}</div>
                          <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.body }}>Stok: {part.stock} unit</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: colors.slate800, fontFamily: fonts.mono }}>{fmt(part.price)}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div style={{ marginTop: 20, background: "#f0f9ff", borderRadius: 10, padding: 16, border: "1px solid #bae6fd" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                  <span style={{ fontSize: 18 }}>{"\uD83D\uDCA1"}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", fontFamily: fonts.body, marginBottom: 4 }}>Tips Diagnosa</div>
                    <div style={{ fontSize: 13, color: "#0c4a6e", fontFamily: fonts.body, lineHeight: 1.5 }}>{data.tips}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
