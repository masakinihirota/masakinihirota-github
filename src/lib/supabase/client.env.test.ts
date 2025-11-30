import { describe, it, expect } from 'vitest'
import { createClient } from './client'

describe('supabase client env checks (RED)', () => {
  it('throws when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    const original = process.env.NEXT_PUBLIC_SUPABASE_URL
    try {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      expect(() => createClient()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/i)
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = original
    }
  })
})
