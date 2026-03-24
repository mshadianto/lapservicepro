import { useState } from "react";
import { SERVICE_TYPES, PARTS_CATALOG } from "../data/constants";
import { fmt, escapeHtml } from "../utils/format";
import { calcOrderTotal } from "../utils/order";
import { fonts, colors, pageTitle, pageSubtitle, inputBase } from "../styles/theme";

function buildInvoiceHtml(order, svc, pts, totalSvc, totalParts) {
  const esc = escapeHtml;
  return `<html><head><title>Invoice ${esc(order.id)}</title><style>
    body{font-family:sans-serif;padding:40px;color:#1e293b}
    h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin:16px 0}
    th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}
    th{background:#f8fafc;font-weight:600;color:#64748b}
    .total{font-size:20px;font-weight:800;text-align:right;margin-top:12px}
  </style></head><body>
    <h1>LapServ Pro — INVOICE</h1>
    <p>No: ${esc(order.id)} | Tanggal: ${esc(order.date)}</p>
    <hr/>
    <p><b>Customer:</b> ${esc(order.customer)}<br/><b>Telepon:</b> ${esc(order.phone)}<br/><b>Laptop:</b> ${esc(order.brand)} (${esc(order.serial || "-")})</p>
    <table><thead><tr><th>Jasa Service</th><th style="text-align:right">Harga</th></tr></thead><tbody>
    ${svc.map((s) => `<tr><td>${esc(s.name)}</td><td style="text-align:right">Rp ${s.price.toLocaleString("id-ID")}</td></tr>`).join("")}
    </tbody></table>
    <table><thead><tr><th>Spare Part</th><th>Qty</th><th style="text-align:right">Subtotal</th></tr></thead><tbody>
    ${pts.map((p) => `<tr><td>${esc(p.name)}</td><td>${p.qty}</td><td style="text-align:right">Rp ${(p.price * p.qty).toLocaleString("id-ID")}</td></tr>`).join("") || '<tr><td colspan="3">-</td></tr>'}
    </tbody></table>
    <div class="total">TOTAL: Rp ${(totalSvc + totalParts).toLocaleString("id-ID")}</div>
    <script>window.print()<\/script>
  </body></html>`;
}

export default function InvoicePage({ orders }) {
  const [selId, setSelId] = useState("");
  const order = orders.find((o) => o.id === selId);

  const printInvoice = () => {
    if (!order) return;
    const svc = order.services.map((sid) => SERVICE_TYPES.find((x) => x.id === sid)).filter(Boolean);
    const pts = order.parts.map((p) => ({ ...PARTS_CATALOG.find((x) => x.id === p.id), qty: p.qty })).filter((p) => p.name);
    const totalSvc = svc.reduce((s, x) => s + x.price, 0);
    const totalParts = pts.reduce((s, p) => s + p.price * p.qty, 0);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(buildInvoiceHtml(order, svc, pts, totalSvc, totalParts));
      w.document.close();
    }
  };

  return (
    <div>
      <h1 style={pageTitle}>Cetak Invoice</h1>
      <p style={{ ...pageSubtitle, margin: "0 0 24px" }}>Buat invoice untuk customer</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select value={selId} onChange={(e) => setSelId(e.target.value)} style={{ ...inputBase, width: 400, cursor: "pointer" }}>
          <option value="">Pilih order...</option>
          {orders.map((o) => <option key={o.id} value={o.id}>{o.id} — {o.customer} ({o.brand})</option>)}
        </select>
        <button onClick={printInvoice} disabled={!order} style={{
          padding: "10px 24px", borderRadius: 10, border: "none",
          cursor: order ? "pointer" : "default",
          background: order ? `linear-gradient(135deg, ${colors.blue500}, ${colors.blue600})` : colors.slate300,
          color: colors.white, fontSize: 13, fontWeight: 600, fontFamily: fonts.body,
        }}>{"\uD83D\uDDA8\uFE0F"} Print Invoice</button>
      </div>

      {order && (() => {
        const svc = order.services.map((sid) => SERVICE_TYPES.find((x) => x.id === sid)).filter(Boolean);
        const pts = order.parts.map((p) => ({ ...PARTS_CATALOG.find((x) => x.id === p.id), qty: p.qty })).filter((p) => p.name);
        const { svcCost, partCost, total } = calcOrderTotal(order);

        return (
          <div style={{ background: colors.white, borderRadius: 14, padding: 28, border: `1px solid ${colors.slate200}`, maxWidth: 600 }}>
            <div style={{ borderBottom: `2px solid ${colors.slate900}`, paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.slate900, fontFamily: fonts.heading }}>{"\uD83D\uDCBB"} INVOICE</div>
              <div style={{ fontSize: 12, color: colors.slate500, fontFamily: fonts.mono, marginTop: 4 }}>{order.id} {"\u2022"} {order.date}</div>
            </div>
            <div style={{ fontSize: 13, color: colors.slate700, fontFamily: fonts.body, lineHeight: 1.8, marginBottom: 20 }}>
              <b>Customer:</b> {order.customer}<br /><b>Telepon:</b> {order.phone}<br /><b>Laptop:</b> {order.brand}
            </div>
            {svc.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: fonts.body, borderBottom: `1px solid ${colors.slate100}` }}>
                <span>{s.name}</span>
                <span style={{ fontWeight: 600, fontFamily: fonts.mono }}>{fmt(s.price)}</span>
              </div>
            ))}
            {pts.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: fonts.body, borderBottom: `1px solid ${colors.slate100}` }}>
                <span>{p.name} x{p.qty}</span>
                <span style={{ fontWeight: 600, fontFamily: fonts.mono }}>{fmt(p.price * p.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 12, borderTop: `2px solid ${colors.slate900}` }}>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.body }}>TOTAL</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: colors.slate900, fontFamily: fonts.heading }}>{fmt(total)}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
