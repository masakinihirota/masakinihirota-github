-- 0010_root_points_nonnegative.sql
-- Add CHECK constraint to root_account_points to prevent negative balances

ALTER TABLE root_account_points
  ADD CONSTRAINT chk_root_account_points_nonnegative CHECK (balance >= 0);
