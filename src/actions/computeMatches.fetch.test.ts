import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

const sampleRows = [
  { profile_id: 'target', work_id: 'w1', tier: 1, claps: 0, liked: false },
  { profile_id: 'a', work_id: 'w1', tier: 1, claps: 0, liked: false },
  { profile_id: 'b', work_id: 'w2', tier: 2, claps: 0, liked: false },
]

// Setup a shared DB mock for this test
const { select } = setupDbMock({ select: () => ({ from: vi.fn().mockResolvedValue(sampleRows) }) })

import { computeMatches } from './computeMatches.fetch'

describe('computeMatches (server action)', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns matches for target profile', async () => {
    const res = await computeMatches('target')
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThanOrEqual(1)
    expect(res[0].profileId).toBe('a')
  })
})
