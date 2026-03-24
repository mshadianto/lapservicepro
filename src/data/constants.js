export const PARTS_CATALOG = [
  { id: "p1", name: 'LCD Screen 14" FHD IPS', price: 890000, category: "Display", stock: 12, supplier: "Enterkomputer", cost: 650000 },
  { id: "p2", name: 'LCD Screen 15.6" FHD', price: 980000, category: "Display", stock: 8, supplier: "Enterkomputer", cost: 720000 },
  { id: "p3", name: "Keyboard Asus", price: 265000, category: "Input", stock: 20, supplier: "CV Maju Jaya", cost: 160000 },
  { id: "p4", name: "Keyboard Lenovo", price: 290000, category: "Input", stock: 15, supplier: "CV Maju Jaya", cost: 175000 },
  { id: "p5", name: "Keyboard HP", price: 275000, category: "Input", stock: 18, supplier: "CV Maju Jaya", cost: 165000 },
  { id: "p6", name: "SSD 256GB NVMe (Cube Gaming)", price: 450000, category: "Storage", stock: 25, supplier: "Enterkomputer", cost: 335000 },
  { id: "p7", name: "SSD 512GB NVMe (Cube Gaming)", price: 750000, category: "Storage", stock: 20, supplier: "Enterkomputer", cost: 550000 },
  { id: "p8", name: "SSD 1TB NVMe Gen4 (V-Gen)", price: 1199000, category: "Storage", stock: 10, supplier: "Enterkomputer", cost: 899000 },
  { id: "p9", name: "RAM 8GB DDR4 3200MHz (KLEVV)", price: 420000, category: "Memory", stock: 30, supplier: "Enterkomputer", cost: 310000 },
  { id: "p10", name: "RAM 16GB DDR4 3200MHz (KLEVV)", price: 780000, category: "Memory", stock: 22, supplier: "Enterkomputer", cost: 580000 },
  { id: "p11", name: "RAM 8GB DDR5 4800MHz (V-Gen)", price: 580000, category: "Memory", stock: 15, supplier: "Enterkomputer", cost: 430000 },
  { id: "p12", name: "Baterai Universal", price: 420000, category: "Power", stock: 18, supplier: "CV Teknik", cost: 260000 },
  { id: "p13", name: "Charger 65W USB-C", price: 195000, category: "Power", stock: 25, supplier: "CV Teknik", cost: 100000 },
  { id: "p14", name: "Charger 90W Barrel", price: 215000, category: "Power", stock: 20, supplier: "CV Teknik", cost: 115000 },
  { id: "p15", name: "Fan/Heatsink Assembly", price: 195000, category: "Cooling", stock: 14, supplier: "CV Teknik", cost: 105000 },
  { id: "p16", name: "Thermal Paste Noctua NT-H1", price: 95000, category: "Cooling", stock: 40, supplier: "Enterkomputer", cost: 65000 },
  { id: "p17", name: "Motherboard Asus (Refurb)", price: 2650000, category: "Mainboard", stock: 5, supplier: "PT Sinar", cost: 1900000 },
  { id: "p18", name: "Motherboard Lenovo (Refurb)", price: 2950000, category: "Mainboard", stock: 4, supplier: "PT Sinar", cost: 2150000 },
  { id: "p19", name: "Hinge Set", price: 165000, category: "Chassis", stock: 20, supplier: "CV Teknik", cost: 80000 },
  { id: "p20", name: "WiFi Card Intel AX200", price: 135000, category: "Network", stock: 18, supplier: "Enterkomputer", cost: 75000 },
  { id: "p21", name: "Touchpad Module", price: 215000, category: "Input", stock: 10, supplier: "CV Maju Jaya", cost: 125000 },
  { id: "p22", name: "Speaker Set", price: 110000, category: "Audio", stock: 16, supplier: "CV Teknik", cost: 55000 },
  { id: "p23", name: "Webcam HD", price: 145000, category: "Camera", stock: 12, supplier: "CV Teknik", cost: 70000 },
  { id: "p24", name: "DC Jack Universal", price: 85000, category: "Power", stock: 25, supplier: "CV Teknik", cost: 38000 },
];

export const SERVICE_TYPES = [
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

export const DAMAGE_PREDICTIONS = {
  "Laptop mati total": {
    severity: "critical",
    possible: ["Motherboard rusak", "Power IC mati", "Baterai kembung/mati", "DC Jack putus"],
    parts: ["p17", "p12", "p24"],
    estCost: [800000, 3500000],
    tips: "Cek charger & baterai dulu. Jika LED mati total, kemungkinan besar motherboard.",
  },
  "Layar blank/bergaris": {
    severity: "high",
    possible: ["LCD Panel rusak", "Kabel LVDS lepas", "GPU overheat", "Inverter mati"],
    parts: ["p1", "p2", "p19"],
    estCost: [200000, 1200000],
    tips: "Coba colok ke monitor eksternal. Jika tampil normal, masalah di LCD/kabel.",
  },
  "Laptop overheat": {
    severity: "medium",
    possible: ["Fan mati", "Thermal paste kering", "Heatsink kotor", "Ventilasi tersumbat"],
    parts: ["p15", "p16"],
    estCost: [80000, 350000],
    tips: "Bersihkan debu rutin. Ganti thermal paste setiap 1-2 tahun.",
  },
  "Keyboard error/tidak fungsi": {
    severity: "medium",
    possible: ["Keyboard rusak fisik", "Kabel flex putus", "Kena cairan", "Driver error"],
    parts: ["p3", "p4", "p5"],
    estCost: [100000, 400000],
    tips: "Jika sebagian tombol saja, kemungkinan kena air. Coba keyboard eksternal.",
  },
  "Laptop lemot/hang": {
    severity: "low",
    possible: ["HDD/SSD degradasi", "RAM kurang", "Virus/Malware", "OS corrupt"],
    parts: ["p6", "p7", "p9", "p10"],
    estCost: [150000, 1000000],
    tips: "Upgrade ke SSD + tambah RAM biasanya solusi paling efektif.",
  },
  "WiFi tidak connect": {
    severity: "low",
    possible: ["WiFi card rusak", "Antena lepas", "Driver error", "BIOS setting"],
    parts: ["p20"],
    estCost: [50000, 250000],
    tips: "Reset network settings dulu. Cek di Device Manager apakah WiFi terdeteksi.",
  },
  "Baterai cepat habis": {
    severity: "medium",
    possible: ["Baterai degradasi", "Software drain", "Charger tidak optimal", "Power IC issue"],
    parts: ["p12", "p13", "p14"],
    estCost: [180000, 600000],
    tips: "Cek cycle count baterai. Di atas 500 cycle biasanya perlu ganti.",
  },
  "Suara tidak keluar": {
    severity: "low",
    possible: ["Speaker rusak", "Audio IC mati", "Driver corrupt", "Jack audio rusak"],
    parts: ["p22"],
    estCost: [50000, 250000],
    tips: "Tes dengan headphone/earphone. Jika keluar suara, speaker internal rusak.",
  },
};

export const INITIAL_ORDERS = [
  { id: "SRV-2026-001", customer: "Ahmad Rizki", phone: "0812-3456-7890", brand: "Asus ROG Strix", serial: "K1N0G2X891", complaint: "Laptop overheat", status: "selesai", techId: "T1", date: "2026-03-10", services: ["s3", "s4"], parts: [{ id: "p15", qty: 1 }, { id: "p16", qty: 1 }], notes: "Fan aus, heatsink kotor parah. Sudah diganti fan + repaste.", rating: 5, completedDate: "2026-03-12" },
  { id: "SRV-2026-002", customer: "Siti Nurhaliza", phone: "0878-1234-5678", brand: "Lenovo IdeaPad 3", serial: "PF3ABCDE12", complaint: "Laptop lemot/hang", status: "dikerjakan", techId: "T2", date: "2026-03-18", services: ["s1", "s2", "s8"], parts: [{ id: "p7", qty: 1 }, { id: "p10", qty: 1 }], notes: "Upgrade SSD 512GB + RAM 16GB. Install Windows 11.", rating: null, completedDate: null },
  { id: "SRV-2026-003", customer: "Budi Santoso", phone: "0856-9876-5432", brand: "HP Pavilion 14", serial: "5CG1234XYZ", complaint: "Layar blank/bergaris", status: "menunggu_part", techId: "T1", date: "2026-03-20", services: ["s1", "s7"], parts: [{ id: "p1", qty: 1 }], notes: "LCD panel retak, perlu ganti. Part sedang dipesan.", rating: null, completedDate: null },
  { id: "SRV-2026-004", customer: "Dewi Lestari", phone: "0813-5678-1234", brand: "Acer Aspire 5", serial: "NXABC123456", complaint: "Keyboard error/tidak fungsi", status: "antrian", techId: null, date: "2026-03-22", services: ["s1"], parts: [], notes: "Keyboard kena tumpahan kopi", rating: null, completedDate: null },
  { id: "SRV-2026-005", customer: "Reza Mahendra", phone: "0857-4321-8765", brand: "Asus VivoBook 15", serial: "M1N2O3P456", complaint: "Baterai cepat habis", status: "diagnosa", techId: "T3", date: "2026-03-23", services: ["s1"], parts: [], notes: "Baterai hanya tahan 30 menit. Cycle count 847.", rating: null, completedDate: null },
];

export const TECHNICIANS = [
  { id: "T1", name: "Pak Hendra", specialty: "Hardware & Motherboard", rating: 4.8, jobs: 342 },
  { id: "T2", name: "Mas Fikri", specialty: "Software & Data Recovery", rating: 4.6, jobs: 278 },
  { id: "T3", name: "Mbak Rini", specialty: "Display & Power Systems", rating: 4.9, jobs: 195 },
];

export const STATUS_CONFIG = {
  antrian: { label: "Antrian", color: "#94a3b8", bg: "#f1f5f9", icon: "\u23F3", step: 1 },
  diagnosa: { label: "Diagnosa", color: "#f59e0b", bg: "#fffbeb", icon: "\uD83D\uDD0D", step: 2 },
  menunggu_part: { label: "Menunggu Part", color: "#8b5cf6", bg: "#f5f3ff", icon: "\uD83D\uDCE6", step: 3 },
  dikerjakan: { label: "Dikerjakan", color: "#3b82f6", bg: "#eff6ff", icon: "\uD83D\uDD27", step: 4 },
  testing: { label: "Testing/QC", color: "#06b6d4", bg: "#ecfeff", icon: "\u2705", step: 5 },
  selesai: { label: "Selesai", color: "#10b981", bg: "#ecfdf5", icon: "\uD83C\uDF89", step: 6 },
  dibatalkan: { label: "Dibatalkan", color: "#ef4444", bg: "#fef2f2", icon: "\u274C", step: 0 },
};
