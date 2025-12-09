 -- =====================================================
-- DSCHANG HYPERMARKET - SUPABASE DATABASE SCHEMA
-- =====================================================
-- This schema creates all tables, RLS policies, and storage
-- for the e-commerce marketplace platform
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: user_profiles
-- Extended user information beyond Supabase Auth
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: stores
-- Seller storefronts/shops
-- =====================================================
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: products
-- Product catalog
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price >= 0 AND sale_price < price),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    images TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    rating_avg DECIMAL(3,2) DEFAULT 0.00 CHECK (rating_avg >= 0 AND rating_avg <= 5),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, slug)
);

-- =====================================================
-- TABLE: orders
-- Customer orders
-- =====================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('mtn_momo', 'orange_money', 'cash_on_delivery')),
    payment_ref TEXT,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: order_items
-- Line items for each order
-- =====================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    product_title TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_store_id ON public.order_items(store_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: user_profiles
-- =====================================================

-- Users can view all profiles
CREATE POLICY "Users can view all profiles"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- RLS POLICIES: stores
-- =====================================================

-- Anyone can view stores
CREATE POLICY "Anyone can view stores"
    ON public.stores FOR SELECT
    TO authenticated, anon
    USING (true);

-- Sellers can create their own store
CREATE POLICY "Sellers can create own store"
    ON public.stores FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = owner_id AND
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('seller', 'admin')
        )
    );

-- Store owners can update their own store
CREATE POLICY "Store owners can update own store"
    ON public.stores FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Store owners can delete their own store
CREATE POLICY "Store owners can delete own store"
    ON public.stores FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- =====================================================
-- RLS POLICIES: products
-- =====================================================

-- Anyone can view products
CREATE POLICY "Anyone can view products"
    ON public.products FOR SELECT
    TO authenticated, anon
    USING (true);

-- Store owners can create products for their store
CREATE POLICY "Store owners can create products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND owner_id = auth.uid()
        )
    );

-- Store owners can update their products
CREATE POLICY "Store owners can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND owner_id = auth.uid()
        )
    );

-- Store owners can delete their products
CREATE POLICY "Store owners can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND owner_id = auth.uid()
        )
    );

-- =====================================================
-- RLS POLICIES: orders
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Store owners can view orders containing their products
CREATE POLICY "Store owners can view orders with their products"
    ON public.orders FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.order_items oi
            JOIN public.stores s ON oi.store_id = s.id
            WHERE oi.order_id = orders.id AND s.owner_id = auth.uid()
        )
    );

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: order_items
-- =====================================================

-- Users can view items from their orders
CREATE POLICY "Users can view own order items"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

-- Store owners can view their order items
CREATE POLICY "Store owners can view their order items"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE id = store_id AND owner_id = auth.uid()
        )
    );

-- Authenticated users can create order items
CREATE POLICY "Authenticated users can create order items"
    ON public.order_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKET for Product Images
-- =====================================================
-- Note: This must be created via Supabase Dashboard > Storage
-- Bucket name: product-images
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Storage policy (execute after creating bucket in dashboard):
-- CREATE POLICY "Public can view product images"
--     ON storage.objects FOR SELECT
--     TO public
--     USING (bucket_id = 'product-images');

-- CREATE POLICY "Authenticated users can upload product images"
--     ON storage.objects FOR INSERT
--     TO authenticated
--     WITH CHECK (bucket_id = 'product-images');

-- CREATE POLICY "Users can update their uploaded images"
--     ON storage.objects FOR UPDATE
--     TO authenticated
--     USING (bucket_id = 'product-images' AND auth.uid()::text = owner);

-- CREATE POLICY "Users can delete their uploaded images"
--     ON storage.objects FOR DELETE
--     TO authenticated
--     USING (bucket_id = 'product-images' AND auth.uid()::text = owner);

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Execute this SQL in Supabase Dashboard > SQL Editor
-- 2. Create storage bucket 'product-images' in Storage section
-- 3. Apply storage policies (commented above)
-- 4. Test connection from your app
-- =====================================================
