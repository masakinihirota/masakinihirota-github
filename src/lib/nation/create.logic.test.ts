import { describe, it, expect } from 'vitest'
import { canCreateNation } from './create.logic'

describe('canCreateNation', () => {
  it('returns failure when root account has insufficient points for nation cost', () => {
    // root account only has 10 points, cost to found a nation is 100 => should fail
    const result = canCreateNation({ rootAccountPoints: 10, cost: 100 })
    expect(result.success).toBe(false)
    // Make the expectation precise: when failing, a reason should be provided
    expect(typeof result.reason).toBe('string')
  })
})
