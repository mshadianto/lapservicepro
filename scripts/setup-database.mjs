import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fxkhtmkfpzjixipifkcw.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4a2h0bWtmcHpqaXhpcGlma2N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMzNDc4OCwiZXhwIjoyMDg5OTEwNzg4fQ.Fb9pgpdSSvd5EgngNFoWnAG7OGrwIGgvfrQrA4x4tSQ";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Step 1: Create exec_sql helper function via raw fetch
async function createExecFunction() {
  console.log("1. Creating exec_sql helper function...");
  const sql = `
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE query;
      RETURN json_build_object('success', true);
    EXCEPTION WHEN OTHERS THEN
      RETURN json_build_object('success', false, 'error', SQLERRM);
    END;
    $$;
  `;

  // Use Supabase's internal pg endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "SELECT 1" }),
  });

  // If function doesn't exist yet, we need another approach
  if (!res.ok) {
    console.log("   exec_sql not found, creating via pg-meta...");
    // Try creating via schema manipulation
    return false;
  }
  return true;
}

// Step 2: Create tables via PostgREST by inserting data
// Since we can't run DDL directly, we'll create a migration SQL file
// and use supabase-js to seed the data after tables are created

const MIGRATION_SQL = `
-- ============================================
-- LapServ Pro Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- 1. USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'technician', 'owner')),
  plan VARCHAR(20) NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  avatar VARCHAR(10) DEFAULT '👤',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. TECHNICIANS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 0,
  jobs_completed INT DEFAULT 0,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. PARTS CATALOG TABLE
-- =====================
CREATE TABLE IF NOT EXISTS parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL DEFAULT 0,
  cost BIGINT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT DEFAULT 5,
  supplier VARCHAR(100),
  sku_external VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. SERVICE TYPES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  price BIGINT NOT NULL DEFAULT 0,
  duration VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. ORDERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  brand VARCHAR(100),
  serial_number VARCHAR(100),
  complaint TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'antrian'
    CHECK (status IN ('antrian','diagnosa','menunggu_part','dikerjakan','testing','selesai','dibatalkan')),
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  notes TEXT,
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  is_paid BOOLEAN DEFAULT false,
  payment_method VARCHAR(20) CHECK (payment_method IS NULL OR payment_method IN ('cash','transfer','qris')),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_date DATE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 6. ORDER SERVICES (junction)
-- =====================
CREATE TABLE IF NOT EXISTS order_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_type_id UUID NOT NULL REFERENCES service_types(id) ON DELETE RESTRICT,
  price BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 7. ORDER PARTS (junction)
-- =====================
CREATE TABLE IF NOT EXISTS order_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  part_id UUID NOT NULL REFERENCES parts(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price BIGINT NOT NULL DEFAULT 0,
  unit_cost BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 8. INVOICES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  subtotal_services BIGINT NOT NULL DEFAULT 0,
  subtotal_parts BIGINT NOT NULL DEFAULT 0,
  discount BIGINT DEFAULT 0,
  tax BIGINT DEFAULT 0,
  total BIGINT NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','void')),
  issued_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 9. EXPENSES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'operasional'
    CHECK (category IN ('sewa','utilitas','gaji','tools','marketing','operasional','lainnya')),
  amount BIGINT NOT NULL DEFAULT 0,
  is_recurring BOOLEAN DEFAULT true,
  period VARCHAR(10) DEFAULT 'monthly' CHECK (period IN ('daily','weekly','monthly','yearly','once')),
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 10. MARKETPLACE CART TABLE
-- =====================
CREATE TABLE IF NOT EXISTS marketplace_cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sku VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 11. ACTIVITY LOG TABLE
-- =====================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(30),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_technician ON orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_order_services_order ON order_services(order_id);
CREATE INDEX IF NOT EXISTS idx_order_parts_order ON order_parts(order_id);
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_stock ON parts(stock) WHERE stock < 10;
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_marketplace_cart_user ON marketplace_cart(user_id);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users','technicians','parts','orders'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_updated_at ON %I;
      CREATE TRIGGER trg_updated_at BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', t, t);
  END LOOP;
END $$;

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

-- Service role can access everything (for API calls with service_role key)
-- Anon/authenticated users go through RLS

-- Allow read for authenticated on most tables
CREATE POLICY "authenticated_read_users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_order_services" ON order_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_order_parts" ON order_parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_invoices" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_technicians" ON technicians FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_parts" ON parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_service_types" ON service_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_expenses" ON expenses FOR SELECT TO authenticated USING (true);

-- Allow anon read on parts & service_types (public catalog)
CREATE POLICY "anon_read_parts" ON parts FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_service_types" ON service_types FOR SELECT TO anon USING (true);

-- Allow all operations for service_role (implicit bypass)
-- Insert/update policies for authenticated
CREATE POLICY "authenticated_insert_orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_orders" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_insert_order_services" ON order_services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_insert_order_parts" ON order_parts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_insert_invoices" ON invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_invoices" ON invoices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_manage_activity" ON activity_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_read_activity" ON activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_manage_cart" ON marketplace_cart FOR ALL TO authenticated USING (user_id = auth.uid());
`;

// Step 3: Seed data
async function seedData() {
  console.log("\n3. Seeding data...");

  // Seed users
  console.log("   → Users...");
  const users = [
    { username: "demo", password_hash: "demo123", name: "Demo User", email: "demo@lapservpro.com", role: "admin", plan: "starter", avatar: "👤" },
    { username: "starter", password_hash: "starter123", name: "Andi Starter", email: "andi@lapservpro.com", role: "technician", plan: "starter", avatar: "🧑‍🔧" },
    { username: "pro", password_hash: "pro123", name: "Budi Profesional", email: "budi@lapservpro.com", role: "admin", plan: "pro", avatar: "👨‍💻" },
    { username: "admin", password_hash: "admin123", name: "Sari Admin", email: "sari@lapservpro.com", role: "admin", plan: "pro", avatar: "👩‍💼" },
    { username: "teknisi", password_hash: "teknisi123", name: "Hendra Teknisi", email: "hendra@lapservpro.com", role: "technician", plan: "pro", avatar: "🧑‍🔧" },
    { username: "enterprise", password_hash: "enterprise123", name: "Diana Enterprise", email: "diana@lapservpro.com", role: "owner", plan: "enterprise", avatar: "👩‍💻" },
    { username: "owner", password_hash: "owner123", name: "Rudi Owner", email: "rudi@lapservpro.com", role: "owner", plan: "enterprise", avatar: "👨‍💼" },
  ];
  const { error: e1 } = await supabase.from("users").upsert(users, { onConflict: "username" });
  if (e1) console.log("   ✗ Users error:", e1.message);
  else console.log("   ✓ 7 users inserted");

  // Seed service types
  console.log("   → Service types...");
  const serviceTypes = [
    { code: "s1", name: "Diagnosa Awal", price: 50000, duration: "30 menit" },
    { code: "s2", name: "Install Ulang OS", price: 150000, duration: "2-3 jam" },
    { code: "s3", name: "Pembersihan Total", price: 100000, duration: "1-2 jam" },
    { code: "s4", name: "Ganti Thermal Paste", price: 80000, duration: "1 jam" },
    { code: "s5", name: "Recovery Data", price: 300000, duration: "2-6 jam" },
    { code: "s6", name: "Repair Motherboard", price: 500000, duration: "3-7 hari" },
    { code: "s7", name: "Ganti LCD/Screen", price: 200000, duration: "1-2 jam" },
    { code: "s8", name: "Upgrade RAM/SSD", price: 100000, duration: "30-60 menit" },
    { code: "s9", name: "Virus & Malware Removal", price: 120000, duration: "1-3 jam" },
    { code: "s10", name: "Repair Keyboard", price: 150000, duration: "1-2 jam" },
  ];
  const { error: e2 } = await supabase.from("service_types").upsert(serviceTypes, { onConflict: "code" });
  if (e2) console.log("   ✗ Service types error:", e2.message);
  else console.log("   ✓ 10 service types inserted");

  // Seed parts
  console.log("   → Parts catalog...");
  const parts = [
    { code: "p1", name: 'LCD Screen 14" FHD IPS', price: 890000, cost: 650000, category: "Display", stock: 12, supplier: "Enterkomputer" },
    { code: "p2", name: 'LCD Screen 15.6" FHD', price: 980000, cost: 720000, category: "Display", stock: 8, supplier: "Enterkomputer" },
    { code: "p3", name: "Keyboard Asus", price: 265000, cost: 160000, category: "Input", stock: 20, supplier: "CV Maju Jaya" },
    { code: "p4", name: "Keyboard Lenovo", price: 290000, cost: 175000, category: "Input", stock: 15, supplier: "CV Maju Jaya" },
    { code: "p5", name: "Keyboard HP", price: 275000, cost: 165000, category: "Input", stock: 18, supplier: "CV Maju Jaya" },
    { code: "p6", name: "SSD 256GB NVMe (Cube Gaming)", price: 450000, cost: 335000, category: "Storage", stock: 25, supplier: "Enterkomputer" },
    { code: "p7", name: "SSD 512GB NVMe (Cube Gaming)", price: 750000, cost: 550000, category: "Storage", stock: 20, supplier: "Enterkomputer" },
    { code: "p8", name: "SSD 1TB NVMe Gen4 (V-Gen)", price: 1199000, cost: 899000, category: "Storage", stock: 10, supplier: "Enterkomputer" },
    { code: "p9", name: "RAM 8GB DDR4 3200MHz (KLEVV)", price: 420000, cost: 310000, category: "Memory", stock: 30, supplier: "Enterkomputer" },
    { code: "p10", name: "RAM 16GB DDR4 3200MHz (KLEVV)", price: 780000, cost: 580000, category: "Memory", stock: 22, supplier: "Enterkomputer" },
    { code: "p11", name: "RAM 8GB DDR5 4800MHz (V-Gen)", price: 580000, cost: 430000, category: "Memory", stock: 15, supplier: "Enterkomputer" },
    { code: "p12", name: "Baterai Universal", price: 420000, cost: 260000, category: "Power", stock: 18, supplier: "CV Teknik" },
    { code: "p13", name: "Charger 65W USB-C", price: 195000, cost: 100000, category: "Power", stock: 25, supplier: "CV Teknik" },
    { code: "p14", name: "Charger 90W Barrel", price: 215000, cost: 115000, category: "Power", stock: 20, supplier: "CV Teknik" },
    { code: "p15", name: "Fan/Heatsink Assembly", price: 195000, cost: 105000, category: "Cooling", stock: 14, supplier: "CV Teknik" },
    { code: "p16", name: "Thermal Paste Noctua NT-H1", price: 95000, cost: 65000, category: "Cooling", stock: 40, supplier: "Enterkomputer" },
    { code: "p17", name: "Motherboard Asus (Refurb)", price: 2650000, cost: 1900000, category: "Mainboard", stock: 5, supplier: "PT Sinar" },
    { code: "p18", name: "Motherboard Lenovo (Refurb)", price: 2950000, cost: 2150000, category: "Mainboard", stock: 4, supplier: "PT Sinar" },
    { code: "p19", name: "Hinge Set", price: 165000, cost: 80000, category: "Chassis", stock: 20, supplier: "CV Teknik" },
    { code: "p20", name: "WiFi Card Intel AX200", price: 135000, cost: 75000, category: "Network", stock: 18, supplier: "Enterkomputer" },
    { code: "p21", name: "Touchpad Module", price: 215000, cost: 125000, category: "Input", stock: 10, supplier: "CV Maju Jaya" },
    { code: "p22", name: "Speaker Set", price: 110000, cost: 55000, category: "Audio", stock: 16, supplier: "CV Teknik" },
    { code: "p23", name: "Webcam HD", price: 145000, cost: 70000, category: "Camera", stock: 12, supplier: "CV Teknik" },
    { code: "p24", name: "DC Jack Universal", price: 85000, cost: 38000, category: "Power", stock: 25, supplier: "CV Teknik" },
  ];
  const { error: e3 } = await supabase.from("parts").upsert(parts, { onConflict: "code" });
  if (e3) console.log("   ✗ Parts error:", e3.message);
  else console.log("   ✓ 24 parts inserted");

  // Seed technicians
  console.log("   → Technicians...");
  const technicians = [
    { code: "T1", name: "Pak Hendra", specialty: "Hardware & Motherboard", rating: 4.8, jobs_completed: 342 },
    { code: "T2", name: "Mas Fikri", specialty: "Software & Data Recovery", rating: 4.6, jobs_completed: 278 },
    { code: "T3", name: "Mbak Rini", specialty: "Display & Power Systems", rating: 4.9, jobs_completed: 195 },
  ];
  const { error: e4 } = await supabase.from("technicians").upsert(technicians, { onConflict: "code" });
  if (e4) console.log("   ✗ Technicians error:", e4.message);
  else console.log("   ✓ 3 technicians inserted");

  // Seed expenses
  console.log("   → Expenses...");
  const expenses = [
    { name: "Sewa Ruko", category: "sewa", amount: 3500000 },
    { name: "Listrik + Internet", category: "utilitas", amount: 800000 },
    { name: "Gaji Teknisi (3 orang)", category: "gaji", amount: 15000000 },
    { name: "Gaji Admin", category: "gaji", amount: 4000000 },
    { name: "Tools & Supplies", category: "tools", amount: 500000 },
    { name: "Marketing Digital", category: "marketing", amount: 1000000 },
  ];
  const { error: e5 } = await supabase.from("expenses").insert(expenses);
  if (e5) console.log("   ✗ Expenses error:", e5.message);
  else console.log("   ✓ 6 expenses inserted");

  // Seed sample orders
  console.log("   → Sample orders...");
  const { data: techs } = await supabase.from("technicians").select("id, code");
  const techMap = {};
  (techs || []).forEach((t) => (techMap[t.code] = t.id));

  const { data: svcData } = await supabase.from("service_types").select("id, code");
  const svcMap = {};
  (svcData || []).forEach((s) => (svcMap[s.code] = s.id));

  const { data: partData } = await supabase.from("parts").select("id, code, price, cost");
  const partMap = {};
  (partData || []).forEach((p) => (partMap[p.code] = p));

  const sampleOrders = [
    { order_number: "SRV-2026-001", customer_name: "Ahmad Rizki", customer_phone: "0812-3456-7890", brand: "Asus ROG Strix", serial_number: "K1N0G2X891", complaint: "Laptop overheat", status: "selesai", technician_id: techMap["T1"], order_date: "2026-03-10", completed_date: "2026-03-12", notes: "Fan aus, heatsink kotor parah. Sudah diganti fan + repaste.", rating: 5, is_paid: true, payment_method: "transfer", services_codes: ["s3", "s4"], parts_codes: [{ code: "p15", qty: 1 }, { code: "p16", qty: 1 }] },
    { order_number: "SRV-2026-002", customer_name: "Siti Nurhaliza", customer_phone: "0878-1234-5678", brand: "Lenovo IdeaPad 3", serial_number: "PF3ABCDE12", complaint: "Laptop lemot/hang", status: "dikerjakan", technician_id: techMap["T2"], order_date: "2026-03-18", notes: "Upgrade SSD 512GB + RAM 16GB. Install Windows 11.", services_codes: ["s1", "s2", "s8"], parts_codes: [{ code: "p7", qty: 1 }, { code: "p10", qty: 1 }] },
    { order_number: "SRV-2026-003", customer_name: "Budi Santoso", customer_phone: "0856-9876-5432", brand: "HP Pavilion 14", serial_number: "5CG1234XYZ", complaint: "Layar blank/bergaris", status: "menunggu_part", technician_id: techMap["T1"], order_date: "2026-03-20", notes: "LCD panel retak, perlu ganti. Part sedang dipesan.", services_codes: ["s1", "s7"], parts_codes: [{ code: "p1", qty: 1 }] },
    { order_number: "SRV-2026-004", customer_name: "Dewi Lestari", customer_phone: "0813-5678-1234", brand: "Acer Aspire 5", serial_number: "NXABC123456", complaint: "Keyboard error/tidak fungsi", status: "antrian", order_date: "2026-03-22", notes: "Keyboard kena tumpahan kopi", services_codes: ["s1"], parts_codes: [] },
    { order_number: "SRV-2026-005", customer_name: "Reza Mahendra", customer_phone: "0857-4321-8765", brand: "Asus VivoBook 15", serial_number: "M1N2O3P456", complaint: "Baterai cepat habis", status: "diagnosa", technician_id: techMap["T3"], order_date: "2026-03-23", notes: "Baterai hanya tahan 30 menit. Cycle count 847.", services_codes: ["s1"], parts_codes: [] },
  ];

  for (const order of sampleOrders) {
    const { services_codes, parts_codes, ...orderData } = order;
    const { data: inserted, error: oe } = await supabase.from("orders").upsert(orderData, { onConflict: "order_number" }).select("id").single();
    if (oe) { console.log(`   ✗ Order ${order.order_number}:`, oe.message); continue; }

    // Link services
    for (const sc of services_codes) {
      if (svcMap[sc]) {
        const svc = svcData.find((s) => s.code === sc);
        await supabase.from("order_services").upsert({
          order_id: inserted.id,
          service_type_id: svcMap[sc],
          price: svc ? (await supabase.from("service_types").select("price").eq("id", svcMap[sc]).single()).data?.price || 0 : 0,
        }, { ignoreDuplicates: true });
      }
    }

    // Link parts
    for (const pc of parts_codes) {
      const pt = partMap[pc.code];
      if (pt) {
        await supabase.from("order_parts").upsert({
          order_id: inserted.id,
          part_id: pt.id,
          quantity: pc.qty,
          unit_price: pt.price,
          unit_cost: pt.cost,
        }, { ignoreDuplicates: true });
      }
    }
  }
  console.log("   ✓ 5 sample orders with services & parts");
}

// Main
async function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║   LapServ Pro — Database Setup       ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log(`Target: ${SUPABASE_URL}\n`);

  console.log("2. Writing migration SQL file...");
  const fs = await import("fs");
  fs.writeFileSync("supabase-migration.sql", MIGRATION_SQL.trim());
  console.log("   ✓ Saved to supabase-migration.sql\n");

  console.log("─────────────────────────────────────");
  console.log("IMPORTANT: Run the SQL migration first!");
  console.log("1. Open: https://supabase.com/dashboard/project/fxkhtmkfpzjixipifkcw/sql/new");
  console.log("2. Paste contents of supabase-migration.sql");
  console.log("3. Click 'Run'");
  console.log("4. Then re-run this script with: node scripts/setup-database.mjs --seed");
  console.log("─────────────────────────────────────\n");

  if (process.argv.includes("--seed")) {
    await seedData();
    console.log("\n✅ Database seeding complete!");
  } else {
    // Try seeding anyway in case tables already exist
    console.log("Attempting to seed (tables may already exist)...\n");
    try {
      await seedData();
      console.log("\n✅ Database setup complete!");
    } catch (err) {
      console.log("\n⚠ Seeding failed — tables may not exist yet.");
      console.log("  Run the SQL migration first, then: node scripts/setup-database.mjs --seed");
    }
  }
}

main().catch(console.error);
