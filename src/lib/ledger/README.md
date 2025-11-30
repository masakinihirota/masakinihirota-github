# Ledger module

Initial implementation of double-entry ledger transfers for root account points.

Files:
- `index.ts` — transferPoints(transactionId, fromRootId, toRootId, amount) executes atomic transfer and logs entries.
- `index.test.ts` — integration tests (require DB environment; set `RUN_DB_TESTS=1` or `DATABASE_URL`).

Behavior and expectations:
- Two `ledger_entries` records are created per transfer (in/out) with identical `transaction_id`.
- Balances in `root_account_points` are updated atomically within the same transaction.
 - Each ledger entry includes a SHA-256 `hash` (computed from transaction_id, ledger_id, direction, amount, balance_before, balance_after) to help detect tampering.
 - Each ledger entry includes a SHA-256 `hash` (computed from transaction_id, ledger_id, direction, amount, balance_before, balance_after) to help detect tampering. A DB-level non-negative balance constraint was added to prevent negative balances at the storage layer.
