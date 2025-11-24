import { describe, it, expect } from 'vitest'
import { achievementsSummary } from './Achievements.logic'

describe('Achievements.logic', () => {
    it('summarizes achievement names', () => {
        expect(achievementsSummary([{ id: 'x', name: 'X' }, { id: 'y', name: 'Y' }])).toBe('X, Y')
    })
})
