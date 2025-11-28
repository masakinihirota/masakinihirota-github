import { describe, it, expect } from 'vitest'
import { previewMessage } from './Messages.logic'

describe('Messages.logic', () => {
    it('previews up to 100 chars', () => {
        expect(previewMessage({ id: 'x', text: 'abc' })).toBe('abc')
    })
})
