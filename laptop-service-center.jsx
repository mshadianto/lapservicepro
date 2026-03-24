import { useState, useEffect, useCallback, useMemo } from "react";

const PARTS_CATALOG = [
  { id: "p1", name: "LCD Screen 14\"", price: 850000, category: "Display", stock: 12 },
  { id: "p2", name: "LCD Screen 15.6\"", price: 950000, category: "Display", stock: 8 },
  { id: "p3", name: "Keyboard Asus", price: 250000, category: "Input", stock: 20 },
  { id: "p4", name: "Keyboard Lenovo", price: 280000, category: "Input", stock: 15 },
  { id: "p5", name: "Keyboard HP", price: 260000, category: "Input", stock: 18 },
  { id: "p6", name: "SSD 256GB NVMe", price: 450000, category: "Storage", stock: 25 },
  { id: "p7", name: "SSD 512GB NVMe", price: 750000, category: "Storage", stock: 20 },
  { id: "p8", name: "SSD 1TB NVMe", price: 1200000, category: "Storage", stock: 10 },
  { id: "p9", name: "RAM 8GB DDR4", price: 350000, category: "Memory", stock: 30 },
  { id: "p10", name: "RAM 16GB DDR4", price: 650000, category: "Memory", stock: 22 },
  { id: "p11", name: "RAM 8GB DDR5", price: 500000, category: "Memory", stock: 15 },
  { id: "p12", name: "Baterai Universal", price: 400000, category: "Power", stock: 18 },
  { id: "p13", name: "Charger 65W USB-C", price: 180000, category: "Power", stock: 25 },
  { id: "p14", name: "Charger 90W Barrel", price: 200000, category: "Power", stock: 20 },
  { id: "p15", name: "Fan/Heatsink Assembly", price: 180000, category: "Cooling", stock: 14 },
  { id: "p16", name: "Thermal Paste Arctic", price: 50000, category: "Cooling", stock: 40 },
  { id: "p17", name: "Motherboard Asus", price: 2500000, category: "Mainboard", stock: 5 },
  { id: "p18", name: "Motherboard Lenovo", price: 2800000, category: "Mainboard", stock: 4 },
  { id: "p19", name: "Hinge Set", price: 150000, category: "Chassis", stock: 20 },
  { id: "p20", name: "WiFi Card AX200", price: 120000, category: "Network", stock: 18 },
  { id: "p21", name: "Touchpad Module", price: 200000, category: "Input", stock: 10 },
  { id: "p22", name: "Speaker Set", price: 100000, category: "Audio", stock: 16 },
  { id: "p23", name: "Webcam Module", price: 130000, category: "Camera", stock: 12 },
  { id: "p24", name: "DC Jack/Port", price: 80000, category: "Power", stock: 25 },
];

const SERVICE_TYPES = [
  { id: "s1", name: "Diagnosa Awal", price: 50000, duration: "30 menit" },
  { id: "s2", name: "Install Ulang OS", price: 150000, duration: "2-3 jam" },
  { id: "s3", name: "Pembersihan Total", price: 100000, duration: "1-2 jam" },
  { id: "s4", name: "Ganti Thermal Paste", price: 80000, duration: "1 jam" },
  { id: "s5", name: "Recovery Data", price: 300000, duration: "2-6 jam" },
  { id: "s6", name: "Repair Motherboard", price: 500000, duration: "3-7 hari" },
  { id: "s7", name: "Ganti LCD/Screen", price: 200000, duration: "1-2 jam" },
  { id: "s8", name: "Upgrade RAM/SSD", price: 100000, duration: "30-60 menit" },
  { id: "s9", name: "Virus & Malware Removal", price: 120000, duration: "1-3 jam" },
  { id: "s10", name: "Repair Keyboard", price: 150000, duration: "1-2 jam" },
];

const DAMAGE_PREDICTIONS = {
  "Laptop mati total": {
    severity: "critical",
    possible: ["Motherboard rusak", "Power IC mati", "Baterai kembung/mati", "DC Jack putus"],
    parts: ["p17", "p12", "p24"],
    estCost: [800000, 3500000],
    tips: "Cek charger & baterai dulu. Jika LED mati total, kemungkinan besar motherboard."
  },
  "Layar blank/bergaris": {
    severity: "high",
    possible: ["LCD Panel rusak", "Kabel LVDS lepas", "GPU overheat", "Inverter mati"],
    parts: ["p1", "p2", "p19"],
    estCost: [200000, 1200000],
    tips: "Coba colok ke monitor eksternal. Jika tampil normal, masalah di LCD/kabel."
  },
  "Laptop overheat": {
    severity: "medium",
    possible: ["Fan mati", "Thermal paste kering", "Heatsink kotor", "Ventilasi tersumbat"],
    parts: ["p15", "p16"],
    estCost: [80000, 350000],
    tips: "Bersihkan debu rutin. Ganti thermal paste setiap 1-2 tahun."
  },
  "Keyboard error/tidak fungsi": {
    severity: "medium",
    possible: ["Keyboard rusak fisik", "Kabel flex putus", "Kena cairan", "Driver error"],
    parts: ["p3", "p4", "p5"],
    estCost: [100000, 400000],
    tips: "Jika sebagian tombol saja, kemungkinan kena air. Coba keyboard eksternal."
  },
  "Laptop lemot/hang": {
    severity: "low",
    possible: ["HDD/SSD degradasi", "RAM kurang", "Virus/Malware", "OS corrupt"],
    parts: ["p6", "p7", "p9", "p10"],
    estCost: [150000, 1000000],
    tips: "Upgrade ke SSD + tambah RAM biasanya solusi paling efektif."
  },
  "WiFi tidak connect": {
    severity: "low",
    possible: ["WiFi card rusak", "Antena lepas", "Driver error", "BIOS setting"],
    parts: ["p20"],
    estCost: [50000, 250000],
    tips: "Reset network settings dulu. Cek di Device Manager apakah WiFi terdeteksi."
  },
  "Baterai cepat habis": {
    severity: "medium",
    possible: ["Baterai degradasi", "Software drain", "Charger tidak optimal", "Power IC issue"],
    parts: ["p12", "p13", "p14"],
    estCost: [180000, 600000],
    tips: "Cek cycle count baterai. Di atas 500 cycle biasanya perlu ganti."
  },
  "Suara tidak keluar": {
    severity: "low",
    possible: ["Speaker rusak", "Audio IC mati", "Driver corrupt", "Jack audio rusak"],
    parts: ["p22"],
    estCost: [50000, 250000],
    tips: "Tes dengan headphone/earphone. Jika keluar suara, speaker internal rusak."
  },
};

const INITIAL_ORDERS = [
  { id: "SRV-2026-001", customer: "Ahmad Rizki", phone: "0812-3456-7890", brand: "Asus ROG Strix", serial: "K1N0G2X891", complaint: "Laptop overheat", status: "selesai", techId: "T1", date: "2026-03-10", services: ["s3", "s4"], parts: [{ id: "p15", qty: 1 }, { id: "p16", qty: 1 }], notes: "Fan aus, heatsink kotor parah. Sudah diganti fan + repaste.", rating: 5, completedDate: "2026-03-12" },
  { id: "SRV-2026-002", customer: "Siti Nurhaliza", phone: "0878-1234-5678", brand: "Lenovo IdeaPad 3", serial: "PF3ABCDE12", complaint: "Laptop lemot/hang", status: "dikerjakan", techId: "T2", date: "2026-03-18", services: ["s1", "s2", "s8"], parts: [{ id: "p7", qty: 1 }, { id: "p10", qty: 1 }], notes: "Upgrade SSD 512GB + RAM 16GB. Install Windows 11.", rating: null, completedDate: null },
  { id: "SRV-2026-003", customer: "Budi Santoso", phone: "0856-9876-5432", brand: "HP Pavilion 14", serial: "5CG1234XYZ", complaint: "Layar blank/bergaris", status: "menunggu_part", techId: "T1", date: "2026-03-20", services: ["s1", "s7"], parts: [{ id: "p1", qty: 1 }], notes: "LCD panel retak, perlu ganti. Part sedang dipesan.", rating: null, completedDate: null },
  { id: "SRV-2026-004", customer: "Dewi Lestari", phone: "0813-5678-1234", brand: "Acer Aspire 5", serial: "NXABC123456", complaint: "Keyboard error/tidak fungsi", status: "antrian", techId: null, date: "2026-03-22", services: ["s1"], parts: [], notes: "Keyboard kena tumpahan kopi", rating: null, completedDate: null },
  { id: "SRV-2026-005", customer: "Reza Mahendra", phone: "0857-4321-8765", brand: "Asus VivoBook 15", serial: "M1N2O3P456", complaint: "Baterai cepat habis", status: "diagnosa", techId: "T3", date: "2026-03-23", services: ["s1"], parts: [], notes: "Baterai hanya tahan 30 menit. Cycle count 847.", rating: null, completedDate: null },
];

const TECHNICIANS = [
  { id: "T1", name: "Pak Hendra", specialty: "Hardware & Motherboard", rating: 4.8, jobs: 342 },
  { id: "T2", name: "Mas Fikri", specialty: "Software & Data Recovery", rating: 4.6, jobs: 278 },
  { id: "T3", name: "Mbak Rini", specialty: "Display & Power Systems", rating: 4.9, jobs: 195 },
];

const STATUS_CONFIG = {
  antrian: { label: "Antrian", color: "#94a3b8", bg: "#f1f5f9", icon: "⏳", step: 1 },
  diagnosa: { label: "Diagnosa", color: "#f59e0b", bg: "#fffbeb", icon: "🔍", step: 2 },
  menunggu_part: { label: "Menunggu Part", color: "#8b5cf6", bg: "#f5f3ff", icon: "📦", step: 3 },
  dikerjakan: { label: "Dikerjakan", color: "#3b82f6", bg: "#eff6ff", icon: "🔧", step: 4 },
  testing: { label: "Testing/QC", color: "#06b6d4", bg: "#ecfeff", icon: "✅", step: 5 },
  selesai: { label: "Selesai", color: "#10b981", bg: "#ecfdf5", icon: "🎉", step: 6 },
  dibatalkan: { label: "Dibatalkan", color: "#ef4444", bg: "#fef2f2", icon: "❌", step: 0 },
};

const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID");

function genId(orders) {
  const num = orders.length + 1;
  return `SRV-2026-${String(num).padStart(3, "0")}`;
}

// ───── COMPONENTS ─────

function Sidebar({ active, setActive, orders }) {
  const pending = orders.filter(o => !["selesai", "dibatalkan"].includes(o.status)).length;
  const items = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "orders", icon: "📋", label: "Order Servis", badge: pending },
    { key: "new", icon: "➕", label: "Servis Baru" },
    { key: "predict", icon: "🤖", label: "Prediksi Kerusakan" },
    { key: "parts", icon: "🔩", label: "Inventori Part" },
    { key: "technicians", icon: "👨‍🔧", label: "Teknisi" },
    { key: "invoice", icon: "🧾", label: "Invoice" },
    { key: "report", icon: "📈", label: "Laporan" },
  ];

  return (
    <div style={{
      width: 250, minHeight: "100vh", background: "linear-gradient(195deg, #0f172a 0%, #1e293b 100%)",
      padding: "0", display: "flex", flexDirection: "column", flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            boxShadow: "0 4px 15px rgba(34,211,238,0.3)"
          }}>💻</div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 15, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>LapServ Pro</div>
            <div style={{ color: "#64748b", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Service Management</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 10px", flex: 1 }}>
        {items.map(it => (
          <div key={it.key} onClick={() => setActive(it.key)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
            cursor: "pointer", marginBottom: 2, transition: "all 0.2s",
            background: active === it.key ? "rgba(59,130,246,0.15)" : "transparent",
            borderLeft: active === it.key ? "3px solid #3b82f6" : "3px solid transparent",
          }}>
            <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>{it.icon}</span>
            <span style={{
              color: active === it.key ? "#e2e8f0" : "#94a3b8", fontSize: 13.5,
              fontWeight: active === it.key ? 600 : 400, fontFamily: "'DM Sans', sans-serif",
            }}>{it.label}</span>
            {it.badge > 0 && (
              <span style={{
                marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "1px 7px", borderRadius: 10, fontFamily: "'DM Mono', monospace"
              }}>{it.badge}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#475569", fontSize: 10, fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
        © 2026 LapServ Pro v2.0
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "20px 22px", flex: "1 1 200px",
      border: "1px solid #e2e8f0", position: "relative", overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      <div style={{ position: "absolute", top: -10, right: -10, width: 70, height: 70, borderRadius: "50%", background: bg, opacity: 0.4 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, background: bg,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
        }}>{icon}</div>
        <div>
          <div style={{ color: "#64748b", fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>{label}</div>
          <div style={{ color: "#0f172a", fontSize: 22, fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}>{value}</div>
          {sub && <div style={{ color, fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.antrian;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 8,
      background: c.bg, color: c.color, fontSize: 11.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      border: `1px solid ${c.color}22`
    }}>
      <span style={{ fontSize: 12 }}>{c.icon}</span>{c.label}
    </span>
  );
}

function ProgressTracker({ status }) {
  const current = STATUS_CONFIG[status]?.step || 0;
  const steps = [
    { step: 1, label: "Antrian" },
    { step: 2, label: "Diagnosa" },
    { step: 3, label: "Part" },
    { step: 4, label: "Kerjakan" },
    { step: 5, label: "Testing" },
    { step: 6, label: "Selesai" },
  ];
  if (status === "dibatalkan") return <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>❌ Dibatalkan</span>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {steps.map((s, i) => (
        <div key={s.step} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%", fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: current >= s.step ? "linear-gradient(135deg, #3b82f6, #22d3ee)" : "#e2e8f0",
            color: current >= s.step ? "#fff" : "#94a3b8", fontFamily: "'DM Mono', monospace",
            transition: "all 0.3s"
          }}>{current >= s.step ? "✓" : s.step}</div>
          {i < steps.length - 1 && (
            <div style={{
              width: 18, height: 2, background: current > s.step ? "#3b82f6" : "#e2e8f0",
              transition: "all 0.3s"
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const map = {
    critical: { bg: "#fef2f2", color: "#dc2626", label: "KRITIS", border: "#fecaca" },
    high: { bg: "#fff7ed", color: "#ea580c", label: "TINGGI", border: "#fed7aa" },
    medium: { bg: "#fffbeb", color: "#d97706", label: "SEDANG", border: "#fde68a" },
    low: { bg: "#f0fdf4", color: "#16a34a", label: "RINGAN", border: "#bbf7d0" },
  };
  const c = map[severity] || map.low;
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 6, background: c.bg, color: c.color,
      fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace",
      border: `1px solid ${c.border}`, letterSpacing: "0.05em"
    }}>{c.label}</span>
  );
}

// ───── PAGES ─────

function DashboardPage({ orders }) {
  const total = orders.length;
  const active = orders.filter(o => !["selesai", "dibatalkan"].includes(o.status)).length;
  const done = orders.filter(o => o.status === "selesai").length;
  const revenue = orders.filter(o => o.status === "selesai").reduce((sum, o) => {
    const svcCost = o.services.reduce((s, sid) => s + (SERVICE_TYPES.find(x => x.id === sid)?.price || 0), 0);
    const partCost = o.parts.reduce((s, p) => s + (PARTS_CATALOG.find(x => x.id === p.id)?.price || 0) * p.qty, 0);
    return sum + svcCost + partCost;
  }, 0);

  const byStatus = {};
  orders.forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
  const byComplaint = {};
  orders.forEach(o => { byComplaint[o.complaint] = (byComplaint[o.complaint] || 0) + 1; });
  const topComplaints = Object.entries(byComplaint).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxComplaint = topComplaints[0]?.[1] || 1;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: 0, letterSpacing: "-0.03em" }}>Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "4px 0 0" }}>Ringkasan aktivitas service laptop hari ini</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon="📋" label="Total Order" value={total} sub="Semua order" color="#3b82f6" bg="#eff6ff" />
        <StatCard icon="🔧" label="Sedang Aktif" value={active} sub="Dalam proses" color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="✅" label="Selesai" value={done} sub={`${total ? Math.round(done/total*100) : 0}% completion`} color="#10b981" bg="#ecfdf5" />
        <StatCard icon="💰" label="Pendapatan" value={fmt(revenue)} sub="Bulan ini" color="#8b5cf6" bg="#f5f3ff" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Status Order</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(STATUS_CONFIG).filter(([k]) => k !== "dibatalkan").map(([key, cfg]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{cfg.icon}</span>
                <span style={{ fontSize: 12.5, color: "#475569", fontFamily: "'DM Sans', sans-serif", width: 110 }}>{cfg.label}</span>
                <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${(byStatus[key] || 0) / Math.max(total, 1) * 100}%`,
                    background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`, transition: "width 0.5s"
                  }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color, width: 24, textAlign: "right", fontFamily: "'DM Mono', monospace" }}>{byStatus[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Top Keluhan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topComplaints.map(([name, count], i) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>{name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", fontFamily: "'DM Mono', monospace" }}>{count}</span>
                </div>
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${count / maxComplaint * 100}%`,
                    background: `linear-gradient(90deg, hsl(${210 + i * 30}, 80%, 55%), hsl(${210 + i * 30}, 80%, 70%))`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0", marginTop: 20 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Order Terbaru</h3>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
          <thead>
            <tr>{["ID", "Customer", "Laptop", "Keluhan", "Status", "Progress"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#64748b", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {orders.slice().reverse().slice(0, 5).map(o => (
              <tr key={o.id} style={{ background: "#fafbfc" }}>
                <td style={{ padding: "10px", fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#3b82f6", fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: "10px", fontSize: 12.5, color: "#1e293b", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{o.customer}</td>
                <td style={{ padding: "10px", fontSize: 12, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{o.brand}</td>
                <td style={{ padding: "10px", fontSize: 12, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{o.complaint}</td>
                <td style={{ padding: "10px" }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: "10px" }}><ProgressTracker status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersPage({ orders, setOrders, setActive }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [editStatus, setEditStatus] = useState(null);

  const filtered = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus, completedDate: newStatus === "selesai" ? new Date().toISOString().split("T")[0] : o.completedDate } : o));
    setEditStatus(null);
  };

  const calcTotal = (o) => {
    const svc = o.services.reduce((s, sid) => s + (SERVICE_TYPES.find(x => x.id === sid)?.price || 0), 0);
    const pts = o.parts.reduce((s, p) => s + (PARTS_CATALOG.find(x => x.id === p.id)?.price || 0) * p.qty, 0);
    return svc + pts;
  };

  if (detail) {
    const o = orders.find(x => x.id === detail);
    if (!o) return null;
    const tech = TECHNICIANS.find(t => t.id === o.techId);
    return (
      <div>
        <button onClick={() => setDetail(null)} style={{
          background: "none", border: "none", color: "#3b82f6", fontSize: 13, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: 16, fontWeight: 500
        }}>← Kembali ke daftar</button>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "24px 28px", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{o.id}</div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{o.customer}</h2>
                <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{o.brand} • {o.serial}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div style={{ marginTop: 16 }}><ProgressTracker status={o.status} /></div>
          </div>
          <div style={{ padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>KELUHAN</div>
                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{o.complaint}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>TELEPON</div>
                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{o.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>TANGGAL MASUK</div>
                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{o.date}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>TEKNISI</div>
                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{tech ? `${tech.name} (${tech.specialty})` : "Belum ditentukan"}</div>
              </div>
            </div>
            {o.notes && (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>CATATAN</div>
                <div style={{ fontSize: 13, color: "#334155", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{o.notes}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Jasa Service</div>
                {o.services.map(sid => {
                  const s = SERVICE_TYPES.find(x => x.id === sid);
                  return s ? (
                    <div key={sid} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 12.5, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{s.name}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", fontFamily: "'DM Mono', monospace" }}>{fmt(s.price)}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Spare Part</div>
                {o.parts.length === 0 ? <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Belum ada part</div> : o.parts.map(p => {
                  const part = PARTS_CATALOG.find(x => x.id === p.id);
                  return part ? (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 12.5, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{part.name} x{p.qty}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", fontFamily: "'DM Mono', monospace" }}>{fmt(part.price * p.qty)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 12, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Total Biaya</span>
              <span style={{ color: "#22d3ee", fontSize: 22, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{fmt(calcTotal(o))}</span>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginRight: 8, lineHeight: "32px" }}>Update Status:</div>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => updateStatus(o.id, key)} style={{
                  padding: "6px 14px", borderRadius: 8, border: `1px solid ${o.status === key ? cfg.color : "#e2e8f0"}`,
                  background: o.status === key ? cfg.bg : "#fff", color: o.status === key ? cfg.color : "#64748b",
                  fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>{cfg.icon} {cfg.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: 0 }}>Order Servis</h1>
          <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "4px 0 0" }}>{filtered.length} order ditemukan</p>
        </div>
        <button onClick={() => setActive("new")} style={{
          padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff",
          fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
        }}>+ Servis Baru</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari customer, ID, atau laptop..." style={{
          padding: "9px 14px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", width: 260, outline: "none", background: "#f8fafc"
        }} />
        {[["all", "Semua"], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "7px 14px", borderRadius: 8, border: `1px solid ${filter === key ? "#3b82f6" : "#e2e8f0"}`,
            background: filter === key ? "#eff6ff" : "#fff", color: filter === key ? "#3b82f6" : "#64748b",
            fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.slice().reverse().map(o => (
          <div key={o.id} onClick={() => setDetail(o.id)} style={{
            background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0",
            cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#3b82f6", fontWeight: 600 }}>{o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{o.customer}</div>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{o.brand} • {o.complaint}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>{fmt(calcTotal(o))}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{o.date}</div>
            </div>
            <div style={{ color: "#cbd5e1", fontSize: 18 }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewOrderPage({ orders, setOrders, setActive }) {
  const [form, setForm] = useState({
    customer: "", phone: "", brand: "", serial: "", complaint: Object.keys(DAMAGE_PREDICTIONS)[0],
    services: ["s1"], parts: [], notes: "", techId: ""
  });
  const [partToAdd, setPartToAdd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (sid) => {
    setForm(f => ({ ...f, services: f.services.includes(sid) ? f.services.filter(x => x !== sid) : [...f.services, sid] }));
  };
  const addPart = () => {
    if (partToAdd && !form.parts.find(p => p.id === partToAdd)) {
      setForm(f => ({ ...f, parts: [...f.parts, { id: partToAdd, qty: 1 }] }));
      setPartToAdd("");
    }
  };
  const removePart = (pid) => setForm(f => ({ ...f, parts: f.parts.filter(p => p.id !== pid) }));
  const updatePartQty = (pid, qty) => setForm(f => ({ ...f, parts: f.parts.map(p => p.id === pid ? { ...p, qty: Math.max(1, qty) } : p) }));

  const totalSvc = form.services.reduce((s, sid) => s + (SERVICE_TYPES.find(x => x.id === sid)?.price || 0), 0);
  const totalParts = form.parts.reduce((s, p) => s + (PARTS_CATALOG.find(x => x.id === p.id)?.price || 0) * p.qty, 0);

  const handleSubmit = () => {
    if (!form.customer || !form.phone || !form.brand) return;
    const newOrder = {
      id: genId(orders), ...form, status: "antrian", date: new Date().toISOString().split("T")[0],
      rating: null, completedDate: null, techId: form.techId || null
    };
    setOrders(prev => [...prev, newOrder]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 8px" }}>Order Berhasil Dibuat!</h2>
        <p style={{ color: "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>Order baru telah masuk ke antrian service</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setForm({ customer: "", phone: "", brand: "", serial: "", complaint: Object.keys(DAMAGE_PREDICTIONS)[0], services: ["s1"], parts: [], notes: "", techId: "" }); setSubmitted(false); }} style={{
            padding: "10px 24px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff",
            color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>+ Buat Lagi</button>
          <button onClick={() => setActive("orders")} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Lihat Daftar</button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 9, border: "1px solid #e2e8f0",
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#f8fafc", boxSizing: "border-box"
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>Servis Baru</h1>
      <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px" }}>Isi data customer dan detail service</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>👤 Data Customer</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={labelStyle}>Nama Customer *</label><input value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} placeholder="Nama lengkap" style={inputStyle} /></div>
            <div><label style={labelStyle}>No. Telepon *</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08xx-xxxx-xxxx" style={inputStyle} /></div>
            <div><label style={labelStyle}>Merk & Tipe Laptop *</label><input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Contoh: Asus ROG Strix G15" style={inputStyle} /></div>
            <div><label style={labelStyle}>Serial Number</label><input value={form.serial} onChange={e => setForm(f => ({ ...f, serial: e.target.value }))} placeholder="Optional" style={inputStyle} /></div>
            <div><label style={labelStyle}>Keluhan</label>
              <select value={form.complaint} onChange={e => setForm(f => ({ ...f, complaint: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                {Object.keys(DAMAGE_PREDICTIONS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Teknisi</label>
              <select value={form.techId} onChange={e => setForm(f => ({ ...f, techId: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Auto-assign</option>
                {TECHNICIANS.map(t => <option key={t.id} value={t.id}>{t.name} — {t.specialty}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Catatan</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Detail keluhan / kondisi laptop..." style={{ ...inputStyle, resize: "vertical" }} /></div>
          </div>
        </div>

        <div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>🔧 Jasa Service</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SERVICE_TYPES.map(s => (
                <button key={s.id} onClick={() => toggleService(s.id)} style={{
                  padding: "7px 12px", borderRadius: 8, fontSize: 11.5, cursor: "pointer",
                  border: `1px solid ${form.services.includes(s.id) ? "#3b82f6" : "#e2e8f0"}`,
                  background: form.services.includes(s.id) ? "#eff6ff" : "#fff",
                  color: form.services.includes(s.id) ? "#3b82f6" : "#64748b",
                  fontWeight: form.services.includes(s.id) ? 600 : 400, fontFamily: "'DM Sans', sans-serif"
                }}>{s.name} • {fmt(s.price)}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>🔩 Spare Part</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <select value={partToAdd} onChange={e => setPartToAdd(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: "pointer" }}>
                <option value="">Pilih part...</option>
                {PARTS_CATALOG.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)} (stok: {p.stock})</option>)}
              </select>
              <button onClick={addPart} style={{
                padding: "0 16px", borderRadius: 9, border: "none", background: "#3b82f6",
                color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16
              }}>+</button>
            </div>
            {form.parts.map(p => {
              const part = PARTS_CATALOG.find(x => x.id === p.id);
              return part ? (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ flex: 1, fontSize: 12.5, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>{part.name}</span>
                  <input type="number" value={p.qty} onChange={e => updatePartQty(p.id, parseInt(e.target.value) || 1)} min={1} style={{ width: 50, padding: "4px 6px", borderRadius: 6, border: "1px solid #e2e8f0", textAlign: "center", fontSize: 12 }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "'DM Mono', monospace", width: 90, textAlign: "right" }}>{fmt(part.price * p.qty)}</span>
                  <button onClick={() => removePart(p.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, color: "#ef4444", cursor: "pointer", padding: "2px 8px", fontSize: 14 }}>×</button>
                </div>
              ) : null;
            })}
          </div>

          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 14, padding: 24
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Jasa Service</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{fmt(totalSvc)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Spare Part</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{fmt(totalParts)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#f8fafc", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>TOTAL</span>
              <span style={{ color: "#22d3ee", fontSize: 26, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{fmt(totalSvc + totalParts)}</span>
            </div>
            <button onClick={handleSubmit} disabled={!form.customer || !form.phone || !form.brand} style={{
              width: "100%", padding: "12px", borderRadius: 10, border: "none", marginTop: 16, cursor: "pointer",
              background: (!form.customer || !form.phone || !form.brand) ? "#475569" : "linear-gradient(135deg, #22d3ee, #3b82f6)",
              color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 15px rgba(34,211,238,0.3)"
            }}>📋 Buat Order Servis</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>Prediksi Kerusakan</h1>
      <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px" }}>Diagnosa AI berdasarkan gejala/keluhan laptop</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {Object.entries(DAMAGE_PREDICTIONS).map(([name, data]) => (
          <div key={name} onClick={() => setSelected(selected === name ? null : name)} style={{
            background: selected === name ? "#f8fafc" : "#fff", borderRadius: 12, padding: "16px 18px",
            border: `2px solid ${selected === name ? "#3b82f6" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.15s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{name}</span>
              <SeverityBadge severity={data.severity} />
            </div>
          </div>
        ))}
      </div>

      {selected && (() => {
        const data = DAMAGE_PREDICTIONS[selected];
        return (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #1e293b, #334155)", padding: "22px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>🤖</span>
                <div>
                  <h3 style={{ margin: 0, color: "#f8fafc", fontSize: 18, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Analisis: {selected}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <SeverityBadge severity={data.severity} />
                    <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Estimasi biaya: {fmt(data.estCost[0])} — {fmt(data.estCost[1])}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: 26 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>🔍 Kemungkinan Penyebab</h4>
                  {data.possible.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "#fff"
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 13, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>🔩 Part yang Mungkin Dibutuhkan</h4>
                  {data.parts.map(pid => {
                    const part = PARTS_CATALOG.find(x => x.id === pid);
                    return part ? (
                      <div key={pid} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div>
                          <div style={{ fontSize: 13, color: "#334155", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{part.name}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>Stok: {part.stock} unit</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", fontFamily: "'DM Mono', monospace" }}>{fmt(part.price)}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div style={{
                marginTop: 20, background: "#f0f9ff", borderRadius: 10, padding: 16,
                border: "1px solid #bae6fd"
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                  <span style={{ fontSize: 18 }}>💡</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>Tips Diagnosa</div>
                    <div style={{ fontSize: 13, color: "#0c4a6e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{data.tips}</div>
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

function PartsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const categories = [...new Set(PARTS_CATALOG.map(p => p.category))];
  const filtered = PARTS_CATALOG.filter(p => {
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalValue = PARTS_CATALOG.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = PARTS_CATALOG.filter(p => p.stock < 10).length;

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>Inventori Spare Part</h1>
      <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 20px" }}>{PARTS_CATALOG.length} item • Total nilai: {fmt(totalValue)}</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard icon="📦" label="Total Item" value={PARTS_CATALOG.length} color="#3b82f6" bg="#eff6ff" />
        <StatCard icon="⚠️" label="Stok Rendah" value={lowStock} sub="< 10 unit" color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="💰" label="Nilai Inventori" value={fmt(totalValue)} color="#10b981" bg="#ecfdf5" />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari part..." style={{
          padding: "9px 14px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", width: 220, outline: "none", background: "#f8fafc"
        }} />
        {["all", ...categories].map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            border: `1px solid ${catFilter === c ? "#3b82f6" : "#e2e8f0"}`,
            background: catFilter === c ? "#eff6ff" : "#fff", color: catFilter === c ? "#3b82f6" : "#64748b", fontWeight: 500
          }}>{c === "all" ? "Semua" : c}</button>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Part", "Kategori", "Harga", "Stok", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#64748b", fontSize: 11.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", fontFamily: "'DM Sans', sans-serif" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{p.id.toUpperCase()}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, background: "#f1f5f9", color: "#475569", fontSize: 11.5, fontFamily: "'DM Sans', sans-serif" }}>{p.category}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e293b", fontFamily: "'DM Mono', monospace" }}>{fmt(p.price)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: p.stock < 10 ? "#ef4444" : "#1e293b" }}>{p.stock}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    background: p.stock < 5 ? "#fef2f2" : p.stock < 10 ? "#fffbeb" : "#ecfdf5",
                    color: p.stock < 5 ? "#ef4444" : p.stock < 10 ? "#f59e0b" : "#10b981",
                    border: `1px solid ${p.stock < 5 ? "#fecaca" : p.stock < 10 ? "#fde68a" : "#bbf7d0"}`
                  }}>{p.stock < 5 ? "Kritis" : p.stock < 10 ? "Rendah" : "Aman"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TechniciansPage() {
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>Tim Teknisi</h1>
      <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px" }}>Manajemen teknisi dan performa</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {TECHNICIANS.map(t => (
          <div key={t.id} style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 14px",
              background: "linear-gradient(135deg, #3b82f6, #22d3ee)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
            }}>👨‍🔧</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>{t.name}</div>
            <div style={{ fontSize: 12.5, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{t.specialty}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, padding: "14px 0", borderTop: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b", fontFamily: "'Outfit', sans-serif" }}>⭐ {t.rating}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>Rating</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6", fontFamily: "'Outfit', sans-serif" }}>{t.jobs}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>Jobs</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoicePage({ orders }) {
  const [selId, setSelId] = useState("");
  const order = orders.find(o => o.id === selId);

  const printInvoice = () => {
    if (!order) return;
    const svc = order.services.map(sid => SERVICE_TYPES.find(x => x.id === sid)).filter(Boolean);
    const pts = order.parts.map(p => ({ ...PARTS_CATALOG.find(x => x.id === p.id), qty: p.qty })).filter(p => p.name);
    const totalSvc = svc.reduce((s, x) => s + x.price, 0);
    const totalParts = pts.reduce((s, p) => s + p.price * p.qty, 0);
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice ${order.id}</title><style>
      body{font-family:sans-serif;padding:40px;color:#1e293b}
      h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}
      th{background:#f8fafc;font-weight:600;color:#64748b}
      .total{font-size:20px;font-weight:800;text-align:right;margin-top:12px}
    </style></head><body>
      <h1>💻 LapServ Pro — INVOICE</h1>
      <p>No: ${order.id} | Tanggal: ${order.date}</p>
      <hr/>
      <p><b>Customer:</b> ${order.customer}<br/><b>Telepon:</b> ${order.phone}<br/><b>Laptop:</b> ${order.brand} (${order.serial || "-"})</p>
      <table><thead><tr><th>Jasa Service</th><th style="text-align:right">Harga</th></tr></thead><tbody>
      ${svc.map(s => `<tr><td>${s.name}</td><td style="text-align:right">Rp ${s.price.toLocaleString("id-ID")}</td></tr>`).join("")}
      </tbody></table>
      <table><thead><tr><th>Spare Part</th><th>Qty</th><th style="text-align:right">Subtotal</th></tr></thead><tbody>
      ${pts.map(p => `<tr><td>${p.name}</td><td>${p.qty}</td><td style="text-align:right">Rp ${(p.price*p.qty).toLocaleString("id-ID")}</td></tr>`).join("") || '<tr><td colspan="3">-</td></tr>'}
      </tbody></table>
      <div class="total">TOTAL: Rp ${(totalSvc + totalParts).toLocaleString("id-ID")}</div>
      <script>window.print()</script>
    </body></html>`);
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>Cetak Invoice</h1>
      <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px" }}>Buat invoice untuk customer</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select value={selId} onChange={e => setSelId(e.target.value)} style={{
          padding: "10px 14px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13,
          fontFamily: "'DM Sans', sans-serif", width: 400, background: "#f8fafc", cursor: "pointer"
        }}>
          <option value="">Pilih order...</option>
          {orders.map(o => <option key={o.id} value={o.id}>{o.id} — {o.customer} ({o.brand})</option>)}
        </select>
        <button onClick={printInvoice} disabled={!order} style={{
          padding: "10px 24px", borderRadius: 10, border: "none", cursor: order ? "pointer" : "default",
          background: order ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#cbd5e1",
          color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
        }}>🖨️ Print Invoice</button>
      </div>
      {order && (() => {
        const svc = order.services.map(sid => SERVICE_TYPES.find(x => x.id === sid)).filter(Boolean);
        const pts = order.parts.map(p => ({ ...PARTS_CATALOG.find(x => x.id === p.id), qty: p.qty })).filter(p => p.name);
        const totalSvc = svc.reduce((s, x) => s + x.price, 0);
        const totalParts = pts.reduce((s, p) => s + p.price * p.qty, 0);
        return (
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #e2e8f0", maxWidth: 600 }}>
            <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>💻 INVOICE</div>
              <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{order.id} • {order.date}</div>
            </div>
            <div style={{ fontSize: 13, color: "#334155", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8, marginBottom: 20 }}>
              <b>Customer:</b> {order.customer}<br/><b>Telepon:</b> {order.phone}<br/><b>Laptop:</b> {order.brand}
            </div>
            {svc.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #f1f5f9" }}>
                <span>{s.name}</span><span style={{ fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{fmt(s.price)}</span>
              </div>
            ))}
            {pts.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #f1f5f9" }}>
                <span>{p.name} x{p.qty}</span><span style={{ fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{fmt(p.price * p.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 12, borderTop: "2px solid #0f172a" }}>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>TOTAL</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>{fmt(totalSvc + totalParts)}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ReportPage({ orders }) {
  const done = orders.filter(o => o.status === "selesai");
  const totalRevenue = done.reduce((s, o) => {
    const svc = o.services.reduce((s2, sid) => s2 + (SERVICE_TYPES.find(x => x.id === sid)?.price || 0), 0);
    const pts = o.parts.reduce((s2, p) => s2 + (PARTS_CATALOG.find(x => x.id === p.id)?.price || 0) * p.qty, 0);
    return s + svc + pts;
  }, 0);
  const avgRating = done.filter(o => o.rating).reduce((s, o, _, a) => s + o.rating / a.length, 0);

  const brandCount = {};
  orders.forEach(o => { const b = o.brand.split(" ")[0]; brandCount[b] = (brandCount[b] || 0) + 1; });
  const topBrands = Object.entries(brandCount).sort((a, b) => b[1] - a[1]);
  const maxBrand = topBrands[0]?.[1] || 1;

  const svcUsage = {};
  orders.forEach(o => o.services.forEach(sid => { svcUsage[sid] = (svcUsage[sid] || 0) + 1; }));
  const topSvc = Object.entries(svcUsage).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = topSvc[0]?.[1] || 1;

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>Laporan & Analitik</h1>
      <p style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 20px" }}>Ringkasan performa bisnis</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon="💰" label="Total Pendapatan" value={fmt(totalRevenue)} color="#10b981" bg="#ecfdf5" />
        <StatCard icon="📋" label="Total Order" value={orders.length} sub={`${done.length} selesai`} color="#3b82f6" bg="#eff6ff" />
        <StatCard icon="⭐" label="Rating Rata-rata" value={avgRating.toFixed(1)} sub="dari 5.0" color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="⏱️" label="Completion Rate" value={`${orders.length ? Math.round(done.length / orders.length * 100) : 0}%`} color="#8b5cf6" bg="#f5f3ff" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Brand Terbanyak</h3>
          {topBrands.map(([name, count]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", fontFamily: "'DM Mono', monospace" }}>{count}</span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${count / maxBrand * 100}%`, background: "linear-gradient(90deg, #3b82f6, #22d3ee)", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Layanan Terpopuler</h3>
          {topSvc.map(([sid, count]) => {
            const s = SERVICE_TYPES.find(x => x.id === sid);
            return s ? (
              <div key={sid} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>{s.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", fontFamily: "'DM Mono', monospace" }}>{count}x</span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${count / maxSvc * 100}%`, background: "linear-gradient(90deg, #10b981, #34d399)", borderRadius: 4 }} />
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

// ───── MAIN APP ─────

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const pageMap = {
    dashboard: <DashboardPage orders={orders} />,
    orders: <OrdersPage orders={orders} setOrders={setOrders} setActive={setActive} />,
    new: <NewOrderPage orders={orders} setOrders={setOrders} setActive={setActive} />,
    predict: <PredictPage />,
    parts: <PartsPage />,
    technicians: <TechniciansPage />,
    invoice: <InvoicePage orders={orders} />,
    report: <ReportPage orders={orders} />,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar active={active} setActive={setActive} orders={orders} />
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "100vh" }}>
          {pageMap[active]}
        </div>
      </div>
    </>
  );
}
