import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import ProgressTracker from "../components/ProgressTracker";
import { STATUS_CONFIG } from "../data/constants";
import { fmt } from "../utils/format";
import { calcOrderTotal } from "../utils/order";
import { fonts, colors, pageTitle, pageSubtitle } from "../styles/theme";

export default function DashboardPage({ orders }) {
  const total = orders.length;
  const active = orders.filter((o) => !["selesai", "dibatalkan"].includes(o.status)).length;
  const done = orders.filter((o) => o.status === "selesai").length;
  const revenue = orders
    .filter((o) => o.status === "selesai")
    .reduce((sum, o) => sum + calcOrderTotal(o).total, 0);

  const byStatus = {};
  orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });

  const byComplaint = {};
  orders.forEach((o) => { byComplaint[o.complaint] = (byComplaint[o.complaint] || 0) + 1; });
  const topComplaints = Object.entries(byComplaint).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxComplaint = topComplaints[0]?.[1] || 1;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={pageTitle}>Dashboard</h1>
        <p style={pageSubtitle}>Ringkasan aktivitas service laptop hari ini</p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon={"\uD83D\uDCCB"} label="Total Order" value={total} sub="Semua order" color={colors.blue500} bg={colors.blue50} />
        <StatCard icon={"\uD83D\uDD27"} label="Sedang Aktif" value={active} sub="Dalam proses" color={colors.amber500} bg={colors.amber50} />
        <StatCard icon={"\u2705"} label="Selesai" value={done} sub={`${total ? Math.round((done / total) * 100) : 0}% completion`} color={colors.green500} bg={colors.green50} />
        <StatCard icon={"\uD83D\uDCB0"} label="Pendapatan" value={fmt(revenue)} sub="Bulan ini" color={colors.violet500} bg={colors.violet50} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: colors.white, borderRadius: 14, padding: 22, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>Status Order</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(STATUS_CONFIG)
              .filter(([k]) => k !== "dibatalkan")
              .map(([key, cfg]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{cfg.icon}</span>
                  <span style={{ fontSize: 12.5, color: colors.slate600, fontFamily: fonts.body, width: 110 }}>{cfg.label}</span>
                  <div style={{ flex: 1, height: 8, background: colors.slate100, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      width: `${((byStatus[key] || 0) / Math.max(total, 1)) * 100}%`,
                      background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
                      transition: "width 0.5s",
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color, width: 24, textAlign: "right", fontFamily: fonts.mono }}>{byStatus[key] || 0}</span>
                </div>
              ))}
          </div>
        </div>

        <div style={{ background: colors.white, borderRadius: 14, padding: 22, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>Top Keluhan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topComplaints.map(([name, count], i) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: colors.slate700, fontFamily: fonts.body }}>{name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.blue500, fontFamily: fonts.mono }}>{count}</span>
                </div>
                <div style={{ height: 6, background: colors.slate100, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${(count / maxComplaint) * 100}%`,
                    background: `linear-gradient(90deg, hsl(${210 + i * 30}, 80%, 55%), hsl(${210 + i * 30}, 80%, 70%))`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: colors.white, borderRadius: 14, padding: 22, border: `1px solid ${colors.slate200}`, marginTop: 20 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>Order Terbaru</h3>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
          <thead>
            <tr>
              {["ID", "Customer", "Laptop", "Keluhan", "Status", "Progress"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: colors.slate500, fontSize: 11, fontWeight: 600, fontFamily: fonts.body, borderBottom: `1px solid ${colors.slate100}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice().reverse().slice(0, 5).map((o) => (
              <tr key={o.id} style={{ background: "#fafbfc" }}>
                <td style={{ padding: 10, fontSize: 12, fontFamily: fonts.mono, color: colors.blue500, fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: 10, fontSize: 12.5, color: colors.slate800, fontFamily: fonts.body, fontWeight: 500 }}>{o.customer}</td>
                <td style={{ padding: 10, fontSize: 12, color: colors.slate600, fontFamily: fonts.body }}>{o.brand}</td>
                <td style={{ padding: 10, fontSize: 12, color: colors.slate600, fontFamily: fonts.body }}>{o.complaint}</td>
                <td style={{ padding: 10 }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: 10 }}><ProgressTracker status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
