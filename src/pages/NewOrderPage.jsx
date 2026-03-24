import { useState } from "react";
import { DAMAGE_PREDICTIONS, SERVICE_TYPES, PARTS_CATALOG, TECHNICIANS } from "../data/constants";
import { fmt } from "../utils/format";
import { fonts, colors, pageTitle, pageSubtitle, inputBase, labelBase } from "../styles/theme";

const EMPTY_FORM = {
  customer: "", phone: "", brand: "", serial: "",
  complaint: Object.keys(DAMAGE_PREDICTIONS)[0],
  services: ["s1"], parts: [], notes: "", techId: "",
};

export default function NewOrderPage({ addOrder, setActive }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [partToAdd, setPartToAdd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleService = (sid) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(sid) ? f.services.filter((x) => x !== sid) : [...f.services, sid],
    }));
  };

  const addPart = () => {
    if (partToAdd && !form.parts.find((p) => p.id === partToAdd)) {
      setForm((f) => ({ ...f, parts: [...f.parts, { id: partToAdd, qty: 1 }] }));
      setPartToAdd("");
    }
  };

  const removePart = (pid) => setForm((f) => ({ ...f, parts: f.parts.filter((p) => p.id !== pid) }));

  const updatePartQty = (pid, qty) => {
    setForm((f) => ({ ...f, parts: f.parts.map((p) => (p.id === pid ? { ...p, qty: Math.max(1, qty) } : p)) }));
  };

  const totalSvc = form.services.reduce((s, sid) => s + (SERVICE_TYPES.find((x) => x.id === sid)?.price || 0), 0);
  const totalParts = form.parts.reduce((s, p) => s + (PARTS_CATALOG.find((x) => x.id === p.id)?.price || 0) * p.qty, 0);
  const isValid = form.customer && form.phone && form.brand;

  const handleSubmit = () => {
    if (!isValid) return;
    addOrder(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{"\u2705"}</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.slate900, fontFamily: fonts.heading, margin: "0 0 8px" }}>Order Berhasil Dibuat!</h2>
        <p style={{ color: colors.slate500, fontSize: 14, fontFamily: fonts.body, marginBottom: 24 }}>Order baru telah masuk ke antrian service</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }} style={{
            padding: "10px 24px", borderRadius: 10, border: `1px solid ${colors.slate200}`,
            background: colors.white, color: colors.slate600, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: fonts.body,
          }}>+ Buat Lagi</button>
          <button onClick={() => setActive("orders")} style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, ${colors.blue500}, ${colors.blue600})`,
            color: colors.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: fonts.body,
          }}>Lihat Daftar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={pageTitle}>Servis Baru</h1>
      <p style={{ ...pageSubtitle, margin: "0 0 24px" }}>Isi data customer dan detail service</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left column: customer data */}
        <div style={{ background: colors.white, borderRadius: 14, padding: 24, border: `1px solid ${colors.slate200}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>{"\uD83D\uDC64"} Data Customer</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={labelBase}>Nama Customer *</label><input value={form.customer} onChange={(e) => updateField("customer", e.target.value)} placeholder="Nama lengkap" style={inputBase} /></div>
            <div><label style={labelBase}>No. Telepon *</label><input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="08xx-xxxx-xxxx" style={inputBase} /></div>
            <div><label style={labelBase}>Merk & Tipe Laptop *</label><input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="Contoh: Asus ROG Strix G15" style={inputBase} /></div>
            <div><label style={labelBase}>Serial Number</label><input value={form.serial} onChange={(e) => updateField("serial", e.target.value)} placeholder="Optional" style={inputBase} /></div>
            <div>
              <label style={labelBase}>Keluhan</label>
              <select value={form.complaint} onChange={(e) => updateField("complaint", e.target.value)} style={{ ...inputBase, cursor: "pointer" }}>
                {Object.keys(DAMAGE_PREDICTIONS).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label style={labelBase}>Teknisi</label>
              <select value={form.techId} onChange={(e) => updateField("techId", e.target.value)} style={{ ...inputBase, cursor: "pointer" }}>
                <option value="">Auto-assign</option>
                {TECHNICIANS.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.specialty}</option>)}
              </select>
            </div>
            <div>
              <label style={labelBase}>Catatan</label>
              <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={3} placeholder="Detail keluhan / kondisi laptop..." style={{ ...inputBase, resize: "vertical" }} />
            </div>
          </div>
        </div>

        {/* Right column: services, parts, total */}
        <div>
          <div style={{ background: colors.white, borderRadius: 14, padding: 24, border: `1px solid ${colors.slate200}`, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>{"\uD83D\uDD27"} Jasa Service</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SERVICE_TYPES.map((s) => {
                const selected = form.services.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleService(s.id)} style={{
                    padding: "7px 12px", borderRadius: 8, fontSize: 11.5, cursor: "pointer",
                    border: `1px solid ${selected ? colors.blue500 : colors.slate200}`,
                    background: selected ? colors.blue50 : colors.white,
                    color: selected ? colors.blue500 : colors.slate500,
                    fontWeight: selected ? 600 : 400, fontFamily: fonts.body,
                  }}>{s.name} {"\u2022"} {fmt(s.price)}</button>
                );
              })}
            </div>
          </div>

          <div style={{ background: colors.white, borderRadius: 14, padding: 24, border: `1px solid ${colors.slate200}`, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: colors.slate900, fontFamily: fonts.heading }}>{"\uD83D\uDD29"} Spare Part</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <select value={partToAdd} onChange={(e) => setPartToAdd(e.target.value)} style={{ ...inputBase, flex: 1, cursor: "pointer" }}>
                <option value="">Pilih part...</option>
                {PARTS_CATALOG.map((p) => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)} (stok: {p.stock})</option>)}
              </select>
              <button onClick={addPart} style={{
                padding: "0 16px", borderRadius: 9, border: "none", background: colors.blue500,
                color: colors.white, fontWeight: 700, cursor: "pointer", fontSize: 16,
              }}>+</button>
            </div>
            {form.parts.map((p) => {
              const part = PARTS_CATALOG.find((x) => x.id === p.id);
              return part ? (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${colors.slate100}` }}>
                  <span style={{ flex: 1, fontSize: 12.5, color: colors.slate700, fontFamily: fonts.body }}>{part.name}</span>
                  <input type="number" value={p.qty} onChange={(e) => updatePartQty(p.id, parseInt(e.target.value) || 1)} min={1} style={{ width: 50, padding: "4px 6px", borderRadius: 6, border: `1px solid ${colors.slate200}`, textAlign: "center", fontSize: 12 }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: fonts.mono, width: 90, textAlign: "right" }}>{fmt(part.price * p.qty)}</span>
                  <button onClick={() => removePart(p.id)} style={{ background: colors.red50, border: "1px solid #fecaca", borderRadius: 6, color: colors.red500, cursor: "pointer", padding: "2px 8px", fontSize: 14 }}>{"\u00D7"}</button>
                </div>
              ) : null;
            })}
          </div>

          <div style={{ background: `linear-gradient(135deg, ${colors.slate900}, ${colors.slate800})`, borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: colors.slate400, fontSize: 13, fontFamily: fonts.body }}>Jasa Service</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: fonts.mono }}>{fmt(totalSvc)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ color: colors.slate400, fontSize: 13, fontFamily: fonts.body }}>Spare Part</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: fonts.mono }}>{fmt(totalParts)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.slate50, fontSize: 15, fontWeight: 600, fontFamily: fonts.body }}>TOTAL</span>
              <span style={{ color: colors.cyan400, fontSize: 26, fontWeight: 800, fontFamily: fonts.heading }}>{fmt(totalSvc + totalParts)}</span>
            </div>
            <button onClick={handleSubmit} disabled={!isValid} style={{
              width: "100%", padding: 12, borderRadius: 10, border: "none", marginTop: 16, cursor: isValid ? "pointer" : "default",
              background: !isValid ? colors.slate600 : `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
              color: colors.white, fontSize: 14, fontWeight: 700, fontFamily: fonts.body,
              boxShadow: isValid ? "0 4px 15px rgba(34,211,238,0.3)" : "none",
            }}>{"\uD83D\uDCCB"} Buat Order Servis</button>
          </div>
        </div>
      </div>
    </div>
  );
}
