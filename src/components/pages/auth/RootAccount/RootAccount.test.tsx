import { describe, it, expect } from 'vitest'
import { isRoot } from './RootAccount.logic'

describe('RootAccount.logic', () => {
    it('detects root role', () => {
        expect(isRoot(['admin', 'root'])).toBe(true)
        expect(isRoot(['user'])).toBe(false)
    })
})
