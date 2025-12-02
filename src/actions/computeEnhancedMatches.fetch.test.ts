'use server'

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock db module
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}))

import { db } from '@/lib/db'
import { computeEnhancedMatches, type EnhancedMatchesResult } from './computeEnhancedMatches.fetch'

describe('computeEnhancedMatches (Server Action)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns enhanced matches with work and value scores', async () => {
    const mockProfileWorks = [
      { profileId: 'target', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
      { profileId: 'other', workId: 'w1', tier: 2, status: 'now', claps: 0, liked: false },
    ]

    const mockProfileValues = [
      { profileId: 'target', valueId: 'v1' },
      { profileId: 'other', valueId: 'v1' },
    ]

    let selectCallCount = 0
    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++
      return {
        from: vi.fn().mockImplementation(() => {
          if (selectCallCount === 1) {
            // First call: profile_works
            return Promise.resolve(mockProfileWorks)
          } else {
            // Second call: profile_values
            return Promise.resolve(mockProfileValues)
          }
        }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    })

    const result: EnhancedMatchesResult[] = await computeEnhancedMatches('target', 10)

    expect(result).toHaveLength(1)
    expect(result[0].profileId).toBe('other')
    expect(result[0].workScore).toBeGreaterThan(0)
    expect(result[0].valueScore).toBeGreaterThan(0)
    expect(result[0].totalScore).toBe(result[0].workScore + result[0].valueScore)
  })

  it('returns empty array when target profile has no works and no values', async () => {
    vi.mocked(db.select).mockImplementation(() => ({
      from: vi.fn().mockResolvedValue([]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any))

    const result = await computeEnhancedMatches('no-such', 10)

    expect(result).toEqual([])
  })

  it('orders results by total score descending', async () => {
    const mockProfileWorks = [
      { profileId: 'target', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
      { profileId: 'target', workId: 'w2', tier: 1, status: 'now', claps: 0, liked: false },
      // userA: 1 common work
      { profileId: 'userA', workId: 'w1', tier: 3, status: 'now', claps: 0, liked: false },
      // userB: 2 common works (higher score)
      { profileId: 'userB', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
      { profileId: 'userB', workId: 'w2', tier: 1, status: 'now', claps: 0, liked: false },
    ]

    const mockProfileValues = [
      { profileId: 'target', valueId: 'v1' },
      { profileId: 'userA', valueId: 'v1' }, // userA also shares value
      { profileId: 'userB', valueId: 'v2' }, // userB has different value
    ]

    let selectCallCount = 0
    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++
      return {
        from: vi.fn().mockImplementation(() => {
          if (selectCallCount === 1) {
            return Promise.resolve(mockProfileWorks)
          } else {
            return Promise.resolve(mockProfileValues)
          }
        }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    })

    const result = await computeEnhancedMatches('target', 10)

    expect(result).toHaveLength(2)
    // userB should be first due to higher work score (2 tier1 matches vs 1 tier3)
    expect(result[0].profileId).toBe('userB')
    expect(result[1].profileId).toBe('userA')
    // But userA has value bonus
    expect(result[1].valueScore).toBeGreaterThan(0)
    expect(result[0].valueScore).toBe(0)
  })

  it('respects the limit parameter', async () => {
    const mockProfileWorks = [
      { profileId: 'target', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
      { profileId: 'user1', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
      { profileId: 'user2', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
      { profileId: 'user3', workId: 'w1', tier: 1, status: 'now', claps: 0, liked: false },
    ]

    let selectCallCount = 0
    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++
      return {
        from: vi.fn().mockImplementation(() => {
          if (selectCallCount === 1) {
            return Promise.resolve(mockProfileWorks)
          } else {
            return Promise.resolve([])
          }
        }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    })

    const result = await computeEnhancedMatches('target', 2)

    expect(result).toHaveLength(2)
  })

  it('includes commonValues in the result', async () => {
    const mockProfileWorks: unknown[] = []

    const mockProfileValues = [
      { profileId: 'target', valueId: 'v1' },
      { profileId: 'target', valueId: 'v2' },
      { profileId: 'other', valueId: 'v1' },
      { profileId: 'other', valueId: 'v2' },
      { profileId: 'other', valueId: 'v3' },
    ]

    let selectCallCount = 0
    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++
      return {
        from: vi.fn().mockImplementation(() => {
          if (selectCallCount === 1) {
            return Promise.resolve(mockProfileWorks)
          } else {
            return Promise.resolve(mockProfileValues)
          }
        }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    })

    const result = await computeEnhancedMatches('target', 10)

    expect(result).toHaveLength(1)
    expect(result[0].commonValues).toHaveLength(2)
    expect(result[0].commonValues.map(v => v.valueId)).toEqual(expect.arrayContaining(['v1', 'v2']))
  })
})
