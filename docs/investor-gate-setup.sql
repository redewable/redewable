-- ============================================================
-- ReDewable Investor Gate — Supabase Table Setup
-- ============================================================
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- These tables power the investor page access gate and tracking.
-- Your existing dataroom_settings table is reused for config.
-- ============================================================

-- 1. INVESTOR VISITORS
-- Stores each person who has been granted access
CREATE TABLE IF NOT EXISTS investor_visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT DEFAULT '',
    access_code TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast login lookups
CREATE INDEX IF NOT EXISTS idx_investor_visitors_email_code
ON investor_visitors (email, access_code);

-- Enable Row Level Security (allow anon key to read/write for now)
ALTER TABLE investor_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read investor_visitors" ON investor_visitors FOR SELECT USING (true);
CREATE POLICY "Allow anon insert investor_visitors" ON investor_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update investor_visitors" ON investor_visitors FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete investor_visitors" ON investor_visitors FOR DELETE USING (true);


-- 2. INVESTOR PAGE VIEWS
-- Tracks every page load by authenticated visitors
CREATE TABLE IF NOT EXISTS investor_page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_email TEXT,
    visitor_name TEXT,
    visitor_company TEXT,
    page_url TEXT,
    page_title TEXT,
    entered_at TIMESTAMPTZ DEFAULT now(),
    exited_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    scroll_depth_pct INTEGER,
    sections_viewed TEXT,
    user_agent TEXT
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_investor_page_views_email
ON investor_page_views (visitor_email);

CREATE INDEX IF NOT EXISTS idx_investor_page_views_entered
ON investor_page_views (entered_at DESC);

ALTER TABLE investor_page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read investor_page_views" ON investor_page_views FOR SELECT USING (true);
CREATE POLICY "Allow anon insert investor_page_views" ON investor_page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update investor_page_views" ON investor_page_views FOR UPDATE USING (true);


-- 3. ADD INVESTOR SETTINGS TO EXISTING SETTINGS TABLE
-- (Only inserts if keys don't already exist)
INSERT INTO dataroom_settings (key, value)
SELECT 'investor_access_mode', 'code'
WHERE NOT EXISTS (SELECT 1 FROM dataroom_settings WHERE key = 'investor_access_mode');

INSERT INTO dataroom_settings (key, value)
SELECT 'investor_shared_password', ''
WHERE NOT EXISTS (SELECT 1 FROM dataroom_settings WHERE key = 'investor_shared_password');


-- ============================================================
-- DONE! Next steps:
-- 1. Go to your admin dashboard (admin.html)
-- 2. Click "Investors" tab
-- 3. Add Kola as a visitor → his unique access code will be generated
-- 4. Send him the link + code
-- 5. Track his visits in real-time from the Investors tab
-- ============================================================
