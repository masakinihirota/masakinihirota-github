import { describe, it, expect } from 'vitest'
import { normalizePreferences } from './Settings.logic'

describe('Settings.logic', () => {
    it('passes through prefs', () => {
        const p = { a: 1 }
        expect(normalizePreferences(p)).toBe(p)
    })
})
