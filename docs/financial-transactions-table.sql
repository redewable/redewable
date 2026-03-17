-- ============================================================
-- ReDew Anson — Financial Transactions Table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    invoice_ref TEXT DEFAULT '',
    invoice_amount TEXT DEFAULT '',
    amount_paid TEXT DEFAULT '',
    due_date DATE,
    terms TEXT DEFAULT '',
    funding_source TEXT DEFAULT '',
    payment_date DATE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (match your existing tables)
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Open policy (same pattern as ntp_tasks)
CREATE POLICY "Allow all access to financial_transactions"
    ON financial_transactions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for fast category lookups
CREATE INDEX idx_fin_txn_category ON financial_transactions(category);
CREATE INDEX idx_fin_txn_status ON financial_transactions(status);
