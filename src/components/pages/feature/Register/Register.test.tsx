import { describe, it, expect } from 'vitest'
import { validEmail } from './Register.logic'

describe('Register.logic', () => {
    it('validates simple email', () => {
        expect(validEmail('a@b')).toBe(true)
        expect(validEmail('abc')).toBe(false)
    })
})
