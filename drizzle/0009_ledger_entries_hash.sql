-- 0009_ledger_entries_hash.sql
-- Add tamper-detection hash column to ledger_entries

ALTER TABLE ledger_entries
  ADD COLUMN IF NOT EXISTS hash text;

CREATE INDEX IF NOT EXISTS idx_ledger_entries_hash ON ledger_entries(hash);
