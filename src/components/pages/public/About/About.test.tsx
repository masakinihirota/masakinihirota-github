import { describe, it, expect } from 'vitest'
import { shortAbout } from './About.logic'

describe('About.logic', () => {
    it('returns first line', () => {
        expect(shortAbout('A\nB')).toBe('A')
    })
})
