import StatCard from "../components/StatCard";
import { SERVICE_TYPES } from "../data/constants";
import { fmt } from "../utils/format";
import { calcOrderTotal } from "../utils/order";
import { fonts, colors, pageTitle, pageSubtitle } from "../styles/theme";

export default function ReportPage({ orders }) {
  const done = orders.filter((o) => o.status === "selesai");
  const totalRevenue = done.reduce((s, o) => s + calcOrderTotal(o).total, 0);
  const avgRating = done.filter((o) => o.rating).reduce((s, o, _, a) => s + o.rating / a.length, 0);

  const brandCount = {};
  orders.forEach((o) => {
    const b = o.brand.split(" ")[0];
    brandCount[b] = (brandCount[b] || 0) + 1;
  });
  const topBrands = Object.entries(brandCount).sort((a, b) => b[1] - a[1]);
  const maxBrand = topBrands[0]?.[1] || 1;

  const svcUsage = {};
  orders.forEach((o) => o.services.forEach((sid) => { svcUsage[sid] = (svcUsage[sid] || 0) + 1; }));
  const topSvc = Object.entries(svcUsage).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = topSvc[0]?.[1] || 1;

  return (
    <div>
      <h1 style={pageTitle}>Laporan & Analitik</h1>
      <p style={{ ...pageSubtitle, margin: "0 0 20px" }}>Ringkasan performa bisnis</p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon={"\uD83D\uDCB0"} label="Total Pendapatan" value={fmt(totalRevenue)} color={colors.green500} bg={colors.green50} />
        <StatCard icon={"\uD83D\uDCCB"} label="Total Order" value={orders.length} sub={`${done.length} selesai`} color={colors.blue500} bg={colors.blue50} />
        <StatCard icon={"\u2B50"} label="Rating Rata-rata" value={avgRating.toFixed(1)} sub="dari 5.0" color={colors.amber500} bg={colors.amber50} />
        <StatCard icon={"\u23F1\uFE0F"} label="Completion Rate" value={`${orders.length ? Math.round((done.length / orders.length) * 100) : 0}%`} color={colors.violet500} bg={colors.violet50} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: colors.white, borderRadius: 14, padding: 22, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>Brand Terbanyak</h3>
          {topBrands.map(([name, count]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: colors.slate700, fontFamily: fonts.body }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.blue500, fontFamily: fonts.mono }}>{count}</span>
              </div>
              <div style={{ height: 8, background: colors.slate100, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / maxBrand) * 100}%`, background: `linear-gradient(90deg, ${colors.blue500}, ${colors.cyan400})`, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: colors.white, borderRadius: 14, padding: 22, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>Layanan Terpopuler</h3>
          {topSvc.map(([sid, count]) => {
            const s = SERVICE_TYPES.find((x) => x.id === sid);
            return s ? (
              <div key={sid} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: colors.slate700, fontFamily: fonts.body }}>{s.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.green500, fontFamily: fonts.mono }}>{count}x</span>
                </div>
                <div style={{ height: 8, background: colors.slate100, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(count / maxSvc) * 100}%`, background: `linear-gradient(90deg, ${colors.green500}, #34d399)`, borderRadius: 4 }} />
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
