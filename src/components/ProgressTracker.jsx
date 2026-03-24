import { fonts, colors } from "../styles/theme";
import { STATUS_CONFIG } from "../data/constants";

const STEPS = [
  { step: 1, label: "Antrian" },
  { step: 2, label: "Diagnosa" },
  { step: 3, label: "Part" },
  { step: 4, label: "Kerjakan" },
  { step: 5, label: "Testing" },
  { step: 6, label: "Selesai" },
];

export default function ProgressTracker({ status }) {
  const current = STATUS_CONFIG[status]?.step || 0;

  if (status === "dibatalkan") {
    return <span style={{ color: colors.red500, fontSize: 12, fontWeight: 600 }}>{"\u274C"} Dibatalkan</span>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {STEPS.map((s, i) => (
        <div key={s.step} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%", fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: current >= s.step ? `linear-gradient(135deg, ${colors.blue500}, ${colors.cyan400})` : colors.slate200,
            color: current >= s.step ? colors.white : colors.slate400,
            fontFamily: fonts.mono, transition: "all 0.3s",
          }}>{current >= s.step ? "\u2713" : s.step}</div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: 18, height: 2,
              background: current > s.step ? colors.blue500 : colors.slate200,
              transition: "all 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
