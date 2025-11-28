import { describe, it, expect } from 'vitest'
import { normalizeAndValidateProfile, type CreateProfilePayload } from './createProfile.logic'

describe('normalizeAndValidateProfile', () => {
  it('trims name and fills defaults', () => {
    const payload: CreateProfilePayload = { rootAccountId: 'r1', name: '  Alice  ' }
    const out = normalizeAndValidateProfile(payload)
    expect(out.name).toBe('Alice')
    expect(out.role).toBe('member')
    expect(out.type).toBe('self')
  })

  it('throws ValidationError for empty name', () => {
    const payload: CreateProfilePayload = { rootAccountId: 'r1', name: '' }
    expect(() => normalizeAndValidateProfile(payload)).toThrow()
  })

  it('throws ValidationError for too long name', () => {
    const long = 'x'.repeat(201)
    const payload: CreateProfilePayload = { rootAccountId: 'r1', name: long }
    expect(() => normalizeAndValidateProfile(payload)).toThrow()
  })

  // RED: Add validation for external links (invalid URL should cause ValidationError)
  it('throws ValidationError when links contain invalid url', () => {
    const payload: any = { rootAccountId: 'r1', name: 'Alice', links: [{ label: 'bad', url: 'not-a-valid-url' }] }
    expect(() => normalizeAndValidateProfile(payload)).toThrow()
  })
})
