import { capitalize } from './utils'
import { describe, it, expect } from 'vitest'

describe('capitalize', () => {
  it('capitalizes a single word', () => {
    expect(capitalize('hello')).toBe('Hello')
  })
})
