import { describe, it, expect } from 'vitest'
import { validateNationName } from './validate'

describe('validateNationName', () => {
  it('rejects names shorter than 3 characters', () => {
    // Expect validation for a too-short name to be false
    expect(validateNationName('ab')).toBe(false)
  })

  it('rejects names longer than 50 characters', () => {
    const longName = 'a'.repeat(100)
    expect(validateNationName(longName)).toBe(false)
  })

  it('rejects names containing control characters (newline/tab)', () => {
    // newline inside the name should be rejected
    expect(validateNationName('ab\nc')).toBe(false)
  })
})
