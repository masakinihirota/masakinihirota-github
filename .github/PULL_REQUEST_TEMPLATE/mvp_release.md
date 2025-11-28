# MVP Release PR Template

Use this template when opening the release PR for the MVP deliverable.

## Summary
- What this PR includes (short bullets)

## Key changes
- Client-server boundary hardening
- Works & Profiles: create/search/upsert flows
- Aggregation: computeWorkAggregates and migration
- Matching: MVP matching algorithm & tests
- CI: integration tests + batch job for aggregates/matching

## Checklist
- [ ] All new tests pass locally and in CI
- [ ] Production build passes (pnpm build)
- [ ] Migration applied (drizzle migration tested)
- [ ] Release notes included (`RELEASE_NOTES_MVP.md`)
- [ ] Any infra/CI secrets/config for integration tests are documented

## Testing notes
- Steps to run integration tests locally (if applicable)

## Rollout Plan
- Any steps required to enable/disable the feature in production, plus rollback guidance

## Follow-ups
- List important follow-up work (organization features, stronger matching, etc.)
