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