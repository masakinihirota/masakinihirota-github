import { describe, it, expect } from 'vitest'
import { summarizeActivity } from './Activity.logic'

describe('Activity.logic', () => {
    it('summarizes titles', () => {
        expect(summarizeActivity([{ id: '1', title: 'A' }, { id: '2', title: 'B' }])).toEqual(['A', 'B'])
    })
})
