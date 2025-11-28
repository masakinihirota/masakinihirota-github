import { describe, it, expect } from 'vitest'
import { mandalaSummary } from './Mandala.logic'

describe('Mandala.logic', () => {
    it('summarizes nodes', () => {
        expect(mandalaSummary(['A', 'B', 'C', 'D'])).toBe('A, B, C')
    })
})
