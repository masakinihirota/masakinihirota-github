-- 0011_ledger_entries_signer_meta.sql
-- Add signer metadata columns to ledger_entries so we can record who signed entries

ALTER TABLE ledger_entries
  ADD COLUMN IF NOT EXISTS signer_type text,
  ADD COLUMN IF NOT EXISTS signer_id text;

CREATE INDEX IF NOT EXISTS idx_ledger_entries_signer_type ON ledger_entries(signer_type);
