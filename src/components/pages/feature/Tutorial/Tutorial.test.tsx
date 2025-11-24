import { describe, it, expect } from 'vitest'
import { lessonPreview } from './Tutorial.logic'

describe('Tutorial.logic', () => {
    it('previews lesson text', () => {
        expect(lessonPreview('Hello world')).toBe('Hello world')
    })
})
