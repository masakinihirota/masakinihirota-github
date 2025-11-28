import { describe, it, expect } from 'vitest'
import { formatSkillLevel } from './Skills.logic'

describe('Skills.logic', () => {
    it('formats skill levels correctly', () => {
        expect(formatSkillLevel(0)).toBe('none')
        expect(formatSkillLevel(2)).toBe('beginner')
        expect(formatSkillLevel(5)).toBe('practiced')
        expect(formatSkillLevel(10)).toBe('expert')
    })
})
