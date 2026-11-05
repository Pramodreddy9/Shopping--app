-- ==============================================================================
-- AURA SHOPPING PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Ready for 1-Click Execution in Supabase SQL Editor
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  materials TEXT,
  dimensions TEXT,
  image_url TEXT NOT NULL,
  badge TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
  tax NUMERIC(10, 2) DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'confirmed',
  tracking_carrier TEXT DEFAULT 'Aura Express Courier',
  tracking_number TEXT,
  estimated_delivery_date TIMESTAMPTZ,
  driver JSONB,
  tracking_milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Allow public insertion of orders (customers checking out)
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT WITH CHECK (true);

-- Allow customers to look up an order by ID or email
CREATE POLICY "Orders can be read by ID or customer email" 
ON public.orders FOR SELECT USING (true);

-- 5. SEED INITIAL PRODUCTS
INSERT INTO public.products (
  id, name, slug, category, price, compare_at_price, stock_quantity, 
  rating, reviews_count, description, features, materials, dimensions, 
  image_url, badge, is_featured
) VALUES
(
  'prod-001',
  'AURA Studio Pro Wireless Headphones',
  'aura-studio-pro-headphones',
  'Audio',
  349.00,
  399.00,
  18,
  4.9,
  142,
  'Bespoke active noise cancellation with 40mm biocellulose planar drivers. Crafted with anodized aluminum arms, lambskin memory foam ear cushions, and 45-hour continuous battery reserve.',
  '["Hybrid Active Noise Cancellation with Transparency Mode", "40mm Biocellulose high-fidelity acoustic drivers", "45-Hour Battery Life with USB-C Quick Charge", "Multipoint Bluetooth 5.4 with lossless LDAC support"]'::jsonb,
  'Anodized aluminum, matte composite, Italian lambskin leather',
  '185 x 165 x 82 mm · 268g',
  '/src/assets/images/product_headphones_1793895217188.jpg',
  'Best Seller',
  true
),
(
  'prod-002',
  'Chronos Titanium Horizon Smartwatch',
  'chronos-titanium-horizon-smartwatch',
  'Wearables',
  495.00,
  550.00,
  7,
  4.8,
  89,
  'Precision milled grade-5 titanium case paired with an ultra-fine ballistic magnetic loop band. Featuring high-luminance sapphire AMOLED display and continuous biometric vitals telemetry.',
  '["Grade 5 Aerospace Titanium chassis", "1.43 Always-On Sapphire Crystal AMOLED", "14-Day battery endurance", "ECG, SpO2 blood oxygen, optical heart rate"]'::jsonb,
  'Grade 5 Aerospace Titanium, Sapphire Crystal glass, Fluorocarbon band',
  '44 x 44 x 10.8 mm · 52g',
  '/src/assets/images/product_smartwatch_1793895217634.jpg',
  'Low Stock',
  true
),
(
  'prod-003',
  'Atelier Raw Sand Ceramic Tumbler',
  'atelier-raw-sand-ceramic-tumbler',
  'Living',
  48.00,
  NULL,
  34,
  4.9,
  64,
  'Hand-thrown high-fire stoneware mug finished with natural speckled sand glaze. Double-insulated ceramic walls preserve beverage temperature with tactile organic ergonomics.',
  '["Hand-thrown in small batches by ceramic artisans", "Dual-wall thermal insulation holds heat for 4+ hours", "Food-grade lead-free glaze, dishwasher safe", "Comfort-grip ergonomic handle with thumb rest"]'::jsonb,
  'High-fire mineral stoneware, matte raw sand glaze',
  '350ml capacity · 90mm diameter x 105mm height',
  '/src/assets/images/product_ceramic_mug_1793895219403.jpg',
  'Handcrafted',
  true
),
(
  'prod-004',
  'Vachetta Minimalist Leather Bifold',
  'vachetta-minimalist-leather-bifold',
  'Leather',
  95.00,
  120.00,
  22,
  4.7,
  51,
  'Full-grain Tuscan vegetable-tanned leather wallet with solid brass hardware. Slim 8mm profile comfortably holds up to 10 cards and flat currency with RFID blocking shielding.',
  '["Genuine certified Tuscan vegetable-tanned full-grain leather", "Integrated military-grade RFID blocking liner", "Hand-burnished waxed edges", "Develops a deep natural patina unique to your journey"]'::jsonb,
  'Full-grain Italian vegetable-tanned leather, brass hardware',
  '108 x 78 x 8 mm (folded) · 48g',
  '/src/assets/images/product_leather_wallet_1793895218852.jpg',
  'Heritage',
  true
)
ON CONFLICT (id) DO NOTHING;
