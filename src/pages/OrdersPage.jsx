import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import ProgressTracker from "../components/ProgressTracker";
import { STATUS_CONFIG, SERVICE_TYPES, PARTS_CATALOG, TECHNICIANS } from "../data/constants";
import { fmt } from "../utils/format";
import { calcOrderTotal } from "../utils/order";
import { fonts, colors, pageTitle, pageSubtitle, card, primaryButton, filterButton } from "../styles/theme";

function OrderDetail({ order, onBack, onUpdateStatus }) {
  const tech = TECHNICIANS.find((t) => t.id === order.techId);
  const { svcCost, partCost, total } = calcOrderTotal(order);

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: colors.blue500, fontSize: 13,
        cursor: "pointer", fontFamily: fonts.body, padding: 0, marginBottom: 16, fontWeight: 500,
      }}>{"\u2190"} Kembali ke daftar</button>

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.slate900}, ${colors.slate800})`, padding: "24px 28px", color: colors.white }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 12, color: colors.slate400, fontFamily: fonts.mono, marginBottom: 4 }}>{order.id}</div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, fontFamily: fonts.heading }}>{order.customer}</h2>
              <div style={{ color: colors.slate400, fontSize: 13, marginTop: 4, fontFamily: fonts.body }}>{order.brand} {"\u2022"} {order.serial}</div>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div style={{ marginTop: 16 }}><ProgressTracker status={order.status} /></div>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {[
              ["KELUHAN", order.complaint],
              ["TELEPON", order.phone],
              ["TANGGAL MASUK", order.date],
              ["TEKNISI", tech ? `${tech.name} (${tech.specialty})` : "Belum ditentukan"],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.body, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: colors.slate800, fontWeight: 500, fontFamily: fonts.body }}>{value}</div>
              </div>
            ))}
          </div>

          {order.notes && (
            <div style={{ background: colors.slate50, borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${colors.slate200}` }}>
              <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.body, marginBottom: 6 }}>CATATAN</div>
              <div style={{ fontSize: 13, color: colors.slate700, fontFamily: fonts.body, lineHeight: 1.5 }}>{order.notes}</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.slate900, marginBottom: 8, fontFamily: fonts.body }}>Jasa Service</div>
              {order.services.map((sid) => {
                const s = SERVICE_TYPES.find((x) => x.id === sid);
                return s ? (
                  <div key={sid} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${colors.slate100}` }}>
                    <span style={{ fontSize: 12.5, color: colors.slate600, fontFamily: fonts.body }}>{s.name}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: colors.slate800, fontFamily: fonts.mono }}>{fmt(s.price)}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.slate900, marginBottom: 8, fontFamily: fonts.body }}>Spare Part</div>
              {order.parts.length === 0 ? (
                <div style={{ fontSize: 12, color: colors.slate400, fontStyle: "italic" }}>Belum ada part</div>
              ) : (
                order.parts.map((p) => {
                  const part = PARTS_CATALOG.find((x) => x.id === p.id);
                  return part ? (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${colors.slate100}` }}>
                      <span style={{ fontSize: 12.5, color: colors.slate600, fontFamily: fonts.body }}>{part.name} x{p.qty}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: colors.slate800, fontFamily: fonts.mono }}>{fmt(part.price * p.qty)}</span>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${colors.slate900}, ${colors.slate800})`, borderRadius: 12,
            padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: colors.slate400, fontSize: 13, fontFamily: fonts.body }}>Total Biaya</span>
            <span style={{ color: colors.cyan400, fontSize: 22, fontWeight: 800, fontFamily: fonts.heading }}>{fmt(total)}</span>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: colors.slate500, fontFamily: fonts.body, marginRight: 8, lineHeight: "32px" }}>Update Status:</div>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => onUpdateStatus(order.id, key)} style={{
                padding: "6px 14px", borderRadius: 8,
                border: `1px solid ${order.status === key ? cfg.color : colors.slate200}`,
                background: order.status === key ? cfg.bg : colors.white,
                color: order.status === key ? cfg.color : colors.slate500,
                fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: fonts.body,
              }}>{cfg.icon} {cfg.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage({ orders, updateStatus, setActive }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState(null);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.brand.toLowerCase().includes(q);
    }
    return true;
  });

  if (detailId) {
    const order = orders.find((x) => x.id === detailId);
    if (!order) return null;
    return <OrderDetail order={order} onBack={() => setDetailId(null)} onUpdateStatus={updateStatus} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={pageTitle}>Order Servis</h1>
          <p style={pageSubtitle}>{filtered.length} order ditemukan</p>
        </div>
        <button onClick={() => setActive("new")} style={primaryButton}>+ Servis Baru</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari customer, ID, atau laptop..." style={{
          padding: "9px 14px", borderRadius: 9, border: `1px solid ${colors.slate200}`, fontSize: 13,
          fontFamily: fonts.body, width: 260, outline: "none", background: colors.slate50,
        }} />
        {[["all", "Semua"], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={filterButton(filter === key)}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.slice().reverse().map((o) => (
          <div key={o.id} onClick={() => setDetailId(o.id)} style={{
            background: colors.white, borderRadius: 12, padding: "16px 20px",
            border: `1px solid ${colors.slate200}`, cursor: "pointer", transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontFamily: fonts.mono, color: colors.blue500, fontWeight: 600 }}>{o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: colors.slate900, fontFamily: fonts.body }}>{o.customer}</div>
              <div style={{ fontSize: 12, color: colors.slate500, fontFamily: fonts.body, marginTop: 2 }}>{o.brand} {"\u2022"} {o.complaint}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>{fmt(calcOrderTotal(o).total)}</div>
              <div style={{ fontSize: 11, color: colors.slate400, fontFamily: fonts.body }}>{o.date}</div>
            </div>
            <div style={{ color: colors.slate300, fontSize: 18 }}>{"\u203A"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
