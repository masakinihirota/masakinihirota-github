import { describe, it, expect } from 'vitest'
import { computeMatchesForProfile } from './computeMatches.logic'

import type { ProfileWork } from '@/lib/aggregations/workAggregations.logic'

describe('computeMatchesForProfile', () => {
  it('returns empty when target profile has no works', () => {
    const data: ProfileWork[] = [{ profileId: 'p1', workId: 'w1', tier: 1 }]
    const res = computeMatchesForProfile('no-such', data)
    expect(res).toEqual([])
  })

  it('scores matches correctly and orders by score', () => {
    const data: ProfileWork[] = [
      { profileId: 'target', workId: 'w1', tier: 1 },
      { profileId: 'target', workId: 'w2', tier: 2 },

      { profileId: 'a', workId: 'w1', tier: 1 }, // strong overlap
      { profileId: 'a', workId: 'w2', tier: 3 },

      { profileId: 'b', workId: 'w2', tier: 2 }, // medium overlap
      { profileId: 'b', workId: 'w3', tier: 1 },
    ]

    const res = computeMatchesForProfile('target', data)
    expect(res.length).toBe(2)
    expect(res[0].profileId).toBe('a')
    expect(res[1].profileId).toBe('b')
  })
})
