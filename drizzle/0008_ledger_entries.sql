-- 0008_ledger_entries.sql
-- Create ledger_entries table for double-entry point ledger

CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL,
  ledger_id uuid NOT NULL, -- references root_account_points.root_account_id
  entry_direction text NOT NULL, -- 'in' | 'out'
  amount integer NOT NULL,
  balance_before integer NOT NULL,
  balance_after integer NOT NULL,
  entry_type text,
  status text,
  counterpart_ledger_id uuid,
  context text,
  workflow_id uuid,
  consent_trace_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_transaction ON ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_ledger ON ledger_entries(ledger_id);
