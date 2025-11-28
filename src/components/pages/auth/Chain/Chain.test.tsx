import { describe, it, expect } from 'vitest'
import { chainSummary } from './Chain.logic'

describe('Chain.logic', () => {
    it('summarizes chain items', () => {
        expect(chainSummary([{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }])).toBe('A › B')
    })
})
