import { useState } from "react";
import StatCard from "../components/StatCard";
import { PARTS_CATALOG } from "../data/constants";
import { fmt } from "../utils/format";
import { fonts, colors, pageTitle, pageSubtitle, filterButton } from "../styles/theme";

const CATEGORIES = [...new Set(PARTS_CATALOG.map((p) => p.category))];

function StockBadge({ stock }) {
  const level = stock < 5 ? "critical" : stock < 10 ? "low" : "safe";
  const config = {
    critical: { bg: colors.red50, color: colors.red500, border: "#fecaca", label: "Kritis" },
    low: { bg: colors.amber50, color: colors.amber500, border: "#fde68a", label: "Rendah" },
    safe: { bg: colors.green50, color: colors.green500, border: "#bbf7d0", label: "Aman" },
  };
  const c = config[level];
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
      fontFamily: fonts.body, background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{c.label}</span>
  );
}

export default function PartsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = PARTS_CATALOG.filter((p) => {
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = PARTS_CATALOG.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = PARTS_CATALOG.filter((p) => p.stock < 10).length;

  return (
    <div>
      <h1 style={pageTitle}>Inventori Spare Part</h1>
      <p style={{ ...pageSubtitle, margin: "0 0 20px" }}>{PARTS_CATALOG.length} item {"\u2022"} Total nilai: {fmt(totalValue)}</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard icon={"\uD83D\uDCE6"} label="Total Item" value={PARTS_CATALOG.length} color={colors.blue500} bg={colors.blue50} />
        <StatCard icon={"\u26A0\uFE0F"} label="Stok Rendah" value={lowStock} sub="< 10 unit" color={colors.amber500} bg={colors.amber50} />
        <StatCard icon={"\uD83D\uDCB0"} label="Nilai Inventori" value={fmt(totalValue)} color={colors.green500} bg={colors.green50} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari part..." style={{
          padding: "9px 14px", borderRadius: 9, border: `1px solid ${colors.slate200}`,
          fontSize: 13, fontFamily: fonts.body, width: 220, outline: "none", background: colors.slate50,
        }} />
        {["all", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCatFilter(c)} style={filterButton(catFilter === c)}>
            {c === "all" ? "Semua" : c}
          </button>
        ))}
      </div>

      <div style={{ background: colors.white, borderRadius: 14, border: `1px solid ${colors.slate200}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: colors.slate50 }}>
              {["Part", "Kategori", "Harga", "Stok", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: colors.slate500, fontSize: 11.5, fontWeight: 600, fontFamily: fonts.body, borderBottom: `1px solid ${colors.slate200}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: colors.slate800, fontFamily: fonts.body }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.mono }}>{p.id.toUpperCase()}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, background: colors.slate100, color: colors.slate600, fontSize: 11.5, fontFamily: fonts.body }}>{p.category}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: colors.slate800, fontFamily: fonts.mono }}>{fmt(p.price)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, fontFamily: fonts.mono, color: p.stock < 10 ? colors.red500 : colors.slate800 }}>{p.stock}</td>
                <td style={{ padding: "12px 16px" }}><StockBadge stock={p.stock} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
