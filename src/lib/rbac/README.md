# RBAC library

This folder contains minimal RBAC helpers used for initial testing and TDD development.

Files:
- `index.ts` — basic Grant type and permission merge (deny-precedence).
- `cache.ts` — stateless computation of `user_authorization_permissions` cache entries.
 - `persist.ts` — DB persistence helpers: refresh cache entries (replace) and clear expired entries.
- `index.test.ts`, `cache.test.ts` — unit tests (run by Vitest).

Notes:
- DB integration tests exist under `src/db/*.test.ts` and will only run when `RUN_DB_TESTS=1` or `DATABASE_URL` is set.
