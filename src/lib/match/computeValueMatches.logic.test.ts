import { describe, it, expect } from 'vitest'
import { computeValueMatchScore, computeEnhancedMatchScore, type ProfileValue, type EnhancedMatchInput } from './computeValueMatches.logic'
import type { ProfileWork } from '@/lib/aggregations/workAggregations.logic'

describe('computeValueMatchScore', () => {
  it('returns 0 when target profile has no values', () => {
    const targetValues: ProfileValue[] = []
    const otherValues: ProfileValue[] = [
      { profileId: 'other', valueId: 'v1' },
    ]
    const score = computeValueMatchScore(targetValues, otherValues)
    expect(score).toBe(0)
  })

  it('returns 0 when no common values exist', () => {
    const targetValues: ProfileValue[] = [
      { profileId: 'target', valueId: 'v1' },
      { profileId: 'target', valueId: 'v2' },
    ]
    const otherValues: ProfileValue[] = [
      { profileId: 'other', valueId: 'v3' },
      { profileId: 'other', valueId: 'v4' },
    ]
    const score = computeValueMatchScore(targetValues, otherValues)
    expect(score).toBe(0)
  })

  it('calculates score based on common values count', () => {
    const targetValues: ProfileValue[] = [
      { profileId: 'target', valueId: 'v1' },
      { profileId: 'target', valueId: 'v2' },
      { profileId: 'target', valueId: 'v3' },
    ]
    const otherValues: ProfileValue[] = [
      { profileId: 'other', valueId: 'v1' }, // common
      { profileId: 'other', valueId: 'v2' }, // common
      { profileId: 'other', valueId: 'v4' }, // not common
    ]
    const score = computeValueMatchScore(targetValues, otherValues)
    // 2 common values * VALUE_MATCH_SCORE (default 50) = 100
    expect(score).toBe(100)
  })

  it('supports custom value score weight', () => {
    const targetValues: ProfileValue[] = [
      { profileId: 'target', valueId: 'v1' },
    ]
    const otherValues: ProfileValue[] = [
      { profileId: 'other', valueId: 'v1' },
    ]
    const score = computeValueMatchScore(targetValues, otherValues, 25)
    expect(score).toBe(25)
  })
})

describe('computeEnhancedMatchScore', () => {
  it('combines work-based and value-based scores', () => {
    const input: EnhancedMatchInput = {
      targetProfileId: 'target',
      otherProfileId: 'other',
      targetWorks: [
        { profileId: 'target', workId: 'w1', tier: 1 },
      ],
      otherWorks: [
        { profileId: 'other', workId: 'w1', tier: 1 },
      ],
      targetValues: [
        { profileId: 'target', valueId: 'v1' },
      ],
      otherValues: [
        { profileId: 'other', valueId: 'v1' },
      ],
    }

    const result = computeEnhancedMatchScore(input)

    // Work score: tier1(100) + tier1(100) = 200
    // Value score: 1 common value * 50 = 50
    // Total: 250
    expect(result.workScore).toBe(200)
    expect(result.valueScore).toBe(50)
    expect(result.totalScore).toBe(250)
    expect(result.commonWorks).toHaveLength(1)
    expect(result.commonValues).toHaveLength(1)
  })

  it('handles zero work overlap with value overlap', () => {
    const input: EnhancedMatchInput = {
      targetProfileId: 'target',
      otherProfileId: 'other',
      targetWorks: [
        { profileId: 'target', workId: 'w1', tier: 1 },
      ],
      otherWorks: [
        { profileId: 'other', workId: 'w2', tier: 2 }, // different work
      ],
      targetValues: [
        { profileId: 'target', valueId: 'v1' },
        { profileId: 'target', valueId: 'v2' },
      ],
      otherValues: [
        { profileId: 'other', valueId: 'v1' },
        { profileId: 'other', valueId: 'v2' },
      ],
    }

    const result = computeEnhancedMatchScore(input)

    expect(result.workScore).toBe(0)
    expect(result.valueScore).toBe(100) // 2 * 50
    expect(result.totalScore).toBe(100)
    expect(result.commonWorks).toHaveLength(0)
    expect(result.commonValues).toHaveLength(2)
  })

  it('respects tier-based scoring for works', () => {
    const input: EnhancedMatchInput = {
      targetProfileId: 'target',
      otherProfileId: 'other',
      targetWorks: [
        { profileId: 'target', workId: 'w1', tier: 1 }, // tier1 = 100
        { profileId: 'target', workId: 'w2', tier: 3 }, // tier3 = 20
      ],
      otherWorks: [
        { profileId: 'other', workId: 'w1', tier: 2 }, // tier2 = 50
        { profileId: 'other', workId: 'w2', tier: 1 }, // tier1 = 100
      ],
      targetValues: [],
      otherValues: [],
    }

    const result = computeEnhancedMatchScore(input)

    // w1: 100 + 50 = 150
    // w2: 20 + 100 = 120
    // Total: 270
    expect(result.workScore).toBe(270)
    expect(result.valueScore).toBe(0)
    expect(result.totalScore).toBe(270)
  })

  it('supports configurable value weight', () => {
    const input: EnhancedMatchInput = {
      targetProfileId: 'target',
      otherProfileId: 'other',
      targetWorks: [],
      otherWorks: [],
      targetValues: [
        { profileId: 'target', valueId: 'v1' },
      ],
      otherValues: [
        { profileId: 'other', valueId: 'v1' },
      ],
    }

    const result = computeEnhancedMatchScore(input, { valueWeight: 100 })

    expect(result.valueScore).toBe(100)
    expect(result.totalScore).toBe(100)
  })
})
