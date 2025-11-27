# MVP Release Notes — masakinihirota (dev → release candidate)

Date: 2025-11-27

Summary:
- Completed an MVP-focused implementation covering: profile creation, work registration/search, profile-work upsert (ratings), work aggregations, and a minimal matching algorithm.
- Added defensive checks and CI improvements to ensure server-only modules are not accidentally bundled into client code.

Key changes:
- Client-server boundary hardening
  - Added script: `scripts/check-client-imports.js` — detects `use client` files that import server-only modules (db, drizzle, postgres, @/db/schema, etc.).
  - README updated with client/server boundary guidelines and check usage.

- Works & Profiles
  - `createWork`, `searchWorks`, `upsertProfileWork` actions implemented and tested.
  - Client forms & wrappers use API routes (`/api/works`, `/api/search-works`, `/api/profile-works`) to avoid client bundling of server modules.

- Aggregation + Match
  - `computeWorkAggregates` batch + migration + CI support (already present)
  - New matching logic (MVP): `src/lib/match/computeMatches.logic.ts` and server action `src/actions/computeMatches.fetch.ts` with unit & integration tests.

- CI
  - `.github/workflows/compute-aggregates.yml` updated to run integration tests including computeMatches.

Next steps (recommended):
1. Finalise release PR and include this summary + test coverage evidence.
2. Implement feature work: organizations/nations/points/penalties and full matching improvements.
3. Consider adding stricter ESLint rules or plugin to statically prevent server-only imports in client files.
