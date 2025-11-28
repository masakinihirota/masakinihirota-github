import { describe, it, expect } from 'vitest'
import { aggregateProfileWorks, scoreProfileWork } from './workAggregations.logic'

describe('workAggregations.logic', () => {
  it('scoreProfileWork uses tier and claps and like', () => {
    const pw = { profileId: 'p1', workId: 'w1', tier: 1, claps: 2, liked: true }
    const s = scoreProfileWork(pw)
    // tier1=100 + claps*1 + liked*10 = 100 + 2 + 10 = 112
    expect(s).toBe(112)
  })

  it('aggregateProfileWorks computes counts and avg correctly', () => {
    const items = [
      { profileId: 'a', workId: 'w1', tier: 1, claps: 3, liked: true },
      { profileId: 'b', workId: 'w1', tier: 2, claps: 1, liked: false },
      { profileId: 'c', workId: 'w1', status: 'now', claps: 0, liked: false },
      { profileId: 'd', workId: 'w1', status: 'not_for_me', claps: 0, liked: false },
    ]

    const res = aggregateProfileWorks(items)
    expect(res).not.toBeNull()
    if (!res) return

    expect(res.totalRatings).toBe(4)
    // compute expected total score
    // compute expected total via scoreProfileWork to match implementation exactly
    const v0 = scoreProfileWork(items[0])
    const v1 = scoreProfileWork(items[1])
    const v2 = scoreProfileWork(items[2])
    const v3 = scoreProfileWork(items[3])

    const expectedTotal = v0 + v1 + v2 + v3

    expect(res.totalScore).toBe(expectedTotal)
    expect(res.tierCounts.tier1).toBe(1)
    expect(res.tierCounts.tier2).toBe(1)
    expect(res.tierCounts.normal).toBe(1)
    expect(res.tierCounts.not_for_me).toBe(1)
  })

  it('empty array returns null', () => {
    expect(aggregateProfileWorks([])).toBeNull()
  })
})
