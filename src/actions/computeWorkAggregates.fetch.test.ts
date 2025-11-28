import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

// sample rows — two for w1, one for w2
const SAMPLE_ROWS = [
  { profile_id: 'p1', work_id: 'w1', tier: 1, status: 'now', claps: 2, liked: true },
  { profile_id: 'p2', work_id: 'w1', tier: 2, status: 'now', claps: 0, liked: false },
  { profile_id: 'p3', work_id: 'w2', tier: 3, status: 'now', claps: 1, liked: false },
]

// prepare mocks ahead of module import so we can mock the db module
const fromMock = vi.fn().mockResolvedValue(SAMPLE_ROWS)
const selectMock = vi.fn(() => ({ from: fromMock }))
const onConflictMock = vi.fn().mockResolvedValue(undefined)
const valuesMock = vi.fn(() => ({ onConflictDoUpdate: onConflictMock }))

// Use central mocked DB helper so test files don't open real DB connections
const { select: selectMockFn, insert: insertMockFn } = setupDbMock({
  select: selectMock,
  insert: () => ({ values: valuesMock }),
})

describe('computeWorkAggregates (server action)', () => {
  beforeEach(() => {
    // keep mock implementations prepared at module scope, only clear call history
    vi.clearAllMocks()
  })

  it('reads profile_works groups and upserts aggregates', async () => {
    // mocks already prepared at module scope (SAMPLE_ROWS)

    const { computeWorkAggregates } = await import('./computeWorkAggregates.fetch')

    const res = await computeWorkAggregates()

    expect(res.success).toBe(true)
    expect(res.processed).toBe(2)

    // should have called values twice (two work ids)
    expect(valuesMock).toHaveBeenCalledTimes(2)
  })
})
