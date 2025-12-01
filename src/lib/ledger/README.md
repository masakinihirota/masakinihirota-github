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
 - Each ledger entry includes an HMAC-SHA256 `hash` (computed from transaction_id, ledger_id, direction, amount, balance_before, balance_after) when the environment variable `LEDGER_HMAC_SECRET` is set. When the secret is missing, the system currently falls back to a plain SHA-256 hash (not cryptographically tamper-resistant).

- Signing configuration: the module supports multiple signer backends via the `LEDGER_SIGNER_TYPE` environment variable.
	- `hmac` (default): use `LEDGER_HMAC_SECRET` for HMAC-SHA256 signing (backward-compatible).
	- `local-ed25519`: use a local Ed25519 keypair to sign entries (dev/test use; looks for `LEDGER_LOCAL_PRIVATE_KEY`/`LEDGER_LOCAL_PUBLIC_KEY` in PEM if provided, otherwise an ephemeral pair is generated). When using `local-ed25519`, the public key is stored in `ledger_entries.signer_id` so verification can be performed later without access to the private key.
	- `kms`: placeholder for a KMS-backed signer (not implemented here — will need provider-specific client wiring).

Notes:
- Set LEDGER_HMAC_SECRET in production (securely via environment or KMS) to make ledger entry hashes tamper-resistant (HMAC). Without it, SHA-256 is used which can be recomputed by an attacker who can modify rows.
- Use `verifyLedgerEntryHash(entry)` to check an entry's hash during audits. A periodic audit job is recommended.

- When entries are signed with a KMS provider, consider populating `LEDGER_SIGNER_ID` (or `ledger_entries.signer_id`) with the KMS key identifier to allow later verification and key rotation tracking.
