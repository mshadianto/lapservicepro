import TierBar from "../components/TierBar";
import StatCard from "../components/StatCard";
import { SERVICE_TYPES, PARTS_CATALOG } from "../data/constants";
import { EXPENSES, MONTHS, HIST_REV } from "../data/subscription";
import { fmt } from "../utils/format";
import { calcOrderTotal } from "../utils/order";
import { fonts, colors } from "../styles/theme";

function calcCost(order) {
  return order.parts.reduce((a, p) => a + (PARTS_CATALOG.find((x) => x.id === p.id)?.cost || 0) * p.qty, 0);
}

export default function FinancePage({ orders }) {
  const done = orders.filter((o) => o.status === "selesai");
  const totalRev = done.reduce((s, o) => s + calcOrderTotal(o).total, 0);
  const totalCOGS = done.reduce((s, o) => s + calcCost(o), 0);
  const svcRev = done.reduce((s, o) => s + calcOrderTotal(o).svcCost, 0);
  const partRev = totalRev - svcRev;
  const grossProfit = totalRev - totalCOGS;
  const totalExp = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalExp;
  const gpM = totalRev ? Math.round((grossProfit / totalRev) * 100) : 0;

  const row = (label, value, indent, colorVal) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11.5, fontFamily: fonts.body }}>
      <span style={{ color: colors.slate600, paddingLeft: indent ? 8 : 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: colorVal || colors.slate900 }}>{value}</span>
    </div>
  );

  const sectionHead = (text) => (
    <div style={{ borderBottom: `2px solid ${colors.slate900}`, paddingBottom: 3, marginBottom: 5, marginTop: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: fonts.body }}>{text}</span>
    </div>
  );

  return (
    <div>
      <TierBar />
      <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: fonts.heading, margin: "0 0 16px" }}>Laporan Keuangan</h1>

      <div style={{ display: "flex", gap: 11, flexWrap: "wrap", marginBottom: 16 }}>
        <StatCard icon={"\uD83D\uDCB0"} label="Pendapatan" value={fmt(totalRev)} color={colors.blue500} bg={colors.blue50} />
        <StatCard icon={"\uD83D\uDCCA"} label="Gross Profit" value={fmt(grossProfit)} sub={`${gpM}%`} color={colors.green500} bg={colors.green50} />
        <StatCard icon={"\uD83D\uDCC8"} label="Net Profit" value={fmt(netProfit)} color={netProfit >= 0 ? colors.violet500 : colors.red500} bg={netProfit >= 0 ? colors.violet50 : colors.red50} />
        <StatCard icon={"\uD83E\uDDFE"} label="Expenses" value={fmt(totalExp)} color={colors.amber500} bg={colors.amber50} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* P&L */}
        <div style={{ background: colors.white, borderRadius: 11, padding: 18, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, fontFamily: fonts.heading }}>{"\uD83D\uDCCB"} Laba Rugi</h3>
          {sectionHead("PENDAPATAN")}
          {row("Jasa Service", fmt(svcRev), true)}
          {row("Part (Enterkomputer)", fmt(partRev), true)}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12, fontWeight: 700, color: colors.blue500 }}>
            <span>Total</span><span>{fmt(totalRev)}</span>
          </div>
          {sectionHead("COGS")}
          {row("Pembelian Part", `(${fmt(totalCOGS)})`, true, colors.red500)}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12, fontWeight: 700, color: colors.green500 }}>
            <span>Gross Profit</span><span>{fmt(grossProfit)} ({gpM}%)</span>
          </div>
          {sectionHead("BEBAN")}
          {EXPENSES.map((e) => row(e.name, `(${fmt(e.amount)})`, true, colors.red500))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", marginTop: 6, borderTop: `3px double ${colors.slate900}`, fontSize: 13, fontWeight: 800 }}>
            <span>NET PROFIT</span>
            <span style={{ color: netProfit >= 0 ? colors.green500 : colors.red500 }}>{netProfit >= 0 ? fmt(netProfit) : `(${fmt(Math.abs(netProfit))})`}</span>
          </div>
        </div>

        {/* Cash Flow + Chart */}
        <div style={{ background: colors.white, borderRadius: 11, padding: 18, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, fontFamily: fonts.heading }}>{"\uD83D\uDCB5"} Arus Kas</h3>
          <div style={{ fontSize: 10.5, fontWeight: 700, marginBottom: 5, borderBottom: `2px solid ${colors.green500}`, paddingBottom: 2 }}>KAS MASUK</div>
          {row("Tunai", `+${fmt(Math.round(totalRev * 0.65))}`, true, colors.green500)}
          {row("Transfer", `+${fmt(Math.round(totalRev * 0.35))}`, true, colors.green500)}
          <div style={{ fontSize: 10.5, fontWeight: 700, marginBottom: 5, marginTop: 8, borderBottom: `2px solid ${colors.red500}`, paddingBottom: 2 }}>KAS KELUAR</div>
          {[["Part", totalCOGS], ["Gaji", 19000000], ["Operasional", 4800000], ["Marketing", 1000000]].map(([l, v]) => row(l, `-${fmt(v)}`, true, colors.red500))}

          <div style={{
            background: `linear-gradient(135deg, ${colors.slate900}, ${colors.slate800})`, borderRadius: 8,
            padding: "10px 12px", marginTop: 10, display: "flex", justifyContent: "space-between",
          }}>
            <span style={{ color: colors.slate400, fontSize: 11.5 }}>Saldo</span>
            <span style={{ color: netProfit >= 0 ? colors.cyan400 : colors.red500, fontSize: 17, fontWeight: 800, fontFamily: fonts.heading }}>{netProfit >= 0 ? "+" : ""}{fmt(netProfit)}</span>
          </div>

          <div style={{ marginTop: 14 }}>
            <h4 style={{ margin: "0 0 6px", fontSize: 11.5, fontWeight: 700, fontFamily: fonts.body }}>Revenue 12 Bulan</h4>
            <div style={{ display: "flex", alignItems: "end", gap: 2, height: 70 }}>
              {HIST_REV.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <div style={{
                    width: "100%", height: `${(v / Math.max(...HIST_REV)) * 60}px`,
                    background: i === 11 ? `linear-gradient(180deg, ${colors.green500}, #059669)` : colors.slate200,
                    borderRadius: 1.5,
                  }} />
                  <span style={{ fontSize: 7, color: colors.slate400 }}>{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
