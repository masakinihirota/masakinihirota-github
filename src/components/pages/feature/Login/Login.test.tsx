import { describe, it, expect } from 'vitest'
import { normalizeLoginId } from './Login.logic'

describe('Login.logic', () => {
    it('normalizes login id', () => {
        expect(normalizeLoginId(' Me ')).toBe('me')
    })
})
