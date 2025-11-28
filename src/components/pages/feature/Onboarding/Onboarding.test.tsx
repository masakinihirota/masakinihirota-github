import { describe, it, expect } from 'vitest'
import { onboardingSteps } from './Onboarding.logic'

describe('Onboarding.logic', () => {
    it('counts steps', () => {
        expect(onboardingSteps(['a', 'b'])).toBe(2)
    })
})
