export const PLANS = {
  starter: {
    id: "starter", name: "Starter", price: 0, priceLabel: "Gratis", color: "#64748b", icon: "\uD83C\uDD93",
    maxOrders: 20, maxUsers: 1,
    features: ["order_basic", "status_tracking", "invoice_manual", "predict_basic", "parts_view"],
    locked: ["ai_diagnosis_full", "marketplace_order", "whatsapp_notif", "finance_report", "inventory_alerts", "multi_branch", "api_access", "white_label", "priority_support", "export_pdf", "customer_portal", "predict_detail"],
    limits: { ordersPerMonth: 20, ekProductsVisible: 5, technicianView: false, financeAccess: false, marketplaceOrder: false, invoicePrint: false, predictDetail: false },
  },
  pro: {
    id: "pro", name: "Professional", price: 299000, priceLabel: "Rp 299K/bln", color: "#3b82f6", icon: "\u2B50",
    maxOrders: 9999, maxUsers: 5,
    features: ["order_basic", "status_tracking", "invoice_manual", "predict_basic", "parts_view", "ai_diagnosis_full", "marketplace_order", "whatsapp_notif", "finance_report", "inventory_alerts", "export_pdf", "customer_portal", "predict_detail"],
    locked: ["multi_branch", "api_access", "white_label", "priority_support"],
    limits: { ordersPerMonth: 9999, ekProductsVisible: 99, technicianView: true, financeAccess: true, marketplaceOrder: true, invoicePrint: true, predictDetail: true },
  },
  enterprise: {
    id: "enterprise", name: "Enterprise", price: 799000, priceLabel: "Rp 799K/bln", color: "#8b5cf6", icon: "\uD83C\uDFE2",
    maxOrders: 99999, maxUsers: 999,
    features: ["order_basic", "status_tracking", "invoice_manual", "predict_basic", "parts_view", "ai_diagnosis_full", "marketplace_order", "whatsapp_notif", "finance_report", "inventory_alerts", "export_pdf", "customer_portal", "predict_detail", "multi_branch", "api_access", "white_label", "priority_support"],
    locked: [],
    limits: { ordersPerMonth: 99999, ekProductsVisible: 99, technicianView: true, financeAccess: true, marketplaceOrder: true, invoicePrint: true, predictDetail: true },
  },
};

export const FEATURE_NAMES = {
  ai_diagnosis_full: "AI Diagnosis Lengkap",
  marketplace_order: "Order di Marketplace",
  whatsapp_notif: "WhatsApp Notifikasi",
  finance_report: "Laporan Keuangan",
  inventory_alerts: "Alert Stok Inventori",
  multi_branch: "Multi-Cabang Dashboard",
  api_access: "API Integrasi",
  white_label: "White Label Branding",
  priority_support: "Priority Support",
  export_pdf: "Export PDF",
  customer_portal: "Portal Customer",
  predict_detail: "Detail Prediksi AI",
};

export const EK_PRODUCTS = [
  { sku: "180263", name: "Cube Gaming Phoenix SSD 256GB SATA III", price: 260000, prevPrice: 235000, cat: "Storage", brand: "Cube Gaming", img: "\uD83D\uDCBE" },
  { sku: "CG-NVME256", name: "Cube Gaming Phoenix SSD 256GB NVMe Gen3", price: 450000, prevPrice: 420000, cat: "Storage", brand: "Cube Gaming", img: "\uD83D\uDCBE" },
  { sku: "CG-NVME512", name: "Cube Gaming Phoenix SSD 512GB NVMe Gen3", price: 750000, prevPrice: 700000, cat: "Storage", brand: "Cube Gaming", img: "\uD83D\uDCBE" },
  { sku: "CG-NVME1TB", name: "Cube Gaming Phoenix SSD 1TB NVMe Gen3", price: 1450000, prevPrice: 1350000, cat: "Storage", brand: "Cube Gaming", img: "\uD83D\uDCBE" },
  { sku: "CJ1RT19", name: "V-Gen SSD NVMe Gen3 256GB Hyper", price: 335000, prevPrice: 295000, cat: "Storage", brand: "V-Gen", img: "\uD83D\uDCBE" },
  { sku: "HKX2H19", name: "V-Gen SSD NVMe Gen3 512GB Hyper", price: 595000, prevPrice: 540000, cat: "Storage", brand: "V-Gen", img: "\uD83D\uDCBE" },
  { sku: "160242", name: "V-Gen SSD NVMe Gen3 1TB Hyper", price: 1695000, prevPrice: 1535000, cat: "Storage", brand: "V-Gen", img: "\uD83D\uDCBE" },
  { sku: "W4NZS19", name: "V-Gen SSD NVMe Gen4 1TB Tsunami", price: 1199000, prevPrice: 1099000, cat: "Storage", brand: "V-Gen", img: "\uD83D\uDCBE" },
  { sku: "RMKSP19", name: "V-Gen SSD NVMe Gen4 2TB Tsunami", price: 2190000, prevPrice: 1930000, cat: "Storage", brand: "V-Gen", img: "\uD83D\uDCBE" },
  { sku: "ADATA710-256", name: "ADATA Legend 710 256GB NVMe", price: 650000, prevPrice: 545000, cat: "Storage", brand: "ADATA", img: "\uD83D\uDCBE" },
  { sku: "ADATA710-512", name: "ADATA Legend 710 512GB NVMe", price: 1040000, prevPrice: 895000, cat: "Storage", brand: "ADATA", img: "\uD83D\uDCBE" },
  { sku: "ADATA710-1TB", name: "ADATA Legend 710 1TB NVMe", price: 1950000, prevPrice: 1609000, cat: "Storage", brand: "ADATA", img: "\uD83D\uDCBE" },
  { sku: "S70B-512", name: "ADATA XPG S70 Blade 512GB Gen4", price: 1450000, prevPrice: 1300000, cat: "Storage", brand: "ADATA XPG", img: "\uD83D\uDCBE" },
  { sku: "S70B-1TB", name: "ADATA XPG S70 Blade 1TB Gen4", price: 2450000, prevPrice: 2160000, cat: "Storage", brand: "ADATA XPG", img: "\uD83D\uDCBE" },
  { sku: "KLEVV-C715-512", name: "KLEVV CRAS C715 512GB NVMe Gen3", price: 890000, prevPrice: 790000, cat: "Storage", brand: "KLEVV", img: "\uD83D\uDCBE" },
  { sku: "KLEVV-C910G-1TB", name: "KLEVV CRAS C910G 1TB NVMe Gen4", price: 1850000, prevPrice: 1650000, cat: "Storage", brand: "KLEVV", img: "\uD83D\uDCBE" },
  { sku: "KLEVV-SD4-8", name: "KLEVV SO-DIMM DDR4 3200MHz 8GB", price: 420000, prevPrice: 350000, cat: "Memory", brand: "KLEVV", img: "\uD83E\uDDE9" },
  { sku: "KLEVV-SD4-16", name: "KLEVV SO-DIMM DDR4 3200MHz 16GB", price: 780000, prevPrice: 650000, cat: "Memory", brand: "KLEVV", img: "\uD83E\uDDE9" },
  { sku: "KLEVV-SD4-32", name: "KLEVV SO-DIMM DDR4 3200MHz 32GB", price: 1480000, prevPrice: 1250000, cat: "Memory", brand: "KLEVV", img: "\uD83E\uDDE9" },
  { sku: "VGEN-SD5-8", name: "V-Gen Platinum SO-DIMM DDR5 4800MHz 8GB", price: 580000, prevPrice: 480000, cat: "Memory", brand: "V-Gen", img: "\uD83E\uDDE9" },
  { sku: "VGEN-SD5-16", name: "V-Gen Platinum SO-DIMM DDR5 5600MHz 16GB", price: 1050000, prevPrice: 890000, cat: "Memory", brand: "V-Gen", img: "\uD83E\uDDE9" },
  { sku: "NT-H1", name: "Noctua NT-H1 Thermal Paste 3.5g", price: 95000, prevPrice: 85000, cat: "Cooling", brand: "Noctua", img: "\uD83E\uDDF4" },
  { sku: "MX6-4G", name: "Arctic MX-6 Thermal Paste 4g", price: 120000, prevPrice: 110000, cat: "Cooling", brand: "Arctic", img: "\uD83E\uDDF4" },
  { sku: "CG-NVME2TB", name: "Cube Gaming Phoenix SSD 2TB NVMe Gen3", price: 2255000, prevPrice: 2100000, cat: "Storage", brand: "Cube Gaming", img: "\uD83D\uDCBE" },
  { sku: "KLEVV-C715-1TB", name: "KLEVV CRAS C715 1TB NVMe Gen3", price: 1650000, prevPrice: 1450000, cat: "Storage", brand: "KLEVV", img: "\uD83D\uDCBE" },
];

export const EXPENSES = [
  { name: "Sewa", amount: 3500000 },
  { name: "Listrik+Internet", amount: 800000 },
  { name: "Gaji Teknisi(3)", amount: 15000000 },
  { name: "Gaji Admin", amount: 4000000 },
  { name: "Tools", amount: 500000 },
  { name: "Marketing", amount: 1000000 },
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const HIST_REV = [8200000, 9500000, 11200000, 10800000, 13500000, 15200000, 14800000, 16900000, 18500000, 20100000, 19200000, 22800000];
