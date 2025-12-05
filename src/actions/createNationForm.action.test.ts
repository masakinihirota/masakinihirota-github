import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock modules
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-123' } }, error: null }))
    }
  }))
}))

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      rootAccounts: {
        findFirst: vi.fn()
      },
      profiles: {
        findFirst: vi.fn()
      },
      rootAccountPoints: {
        findFirst: vi.fn(() => Promise.resolve({ balance: 20000 }))
      }
    },
    transaction: vi.fn((callback: (tx: any) => Promise<void>) => {
      const mockTx = {
        insert: vi.fn(() => ({
          values: vi.fn(() => ({
            returning: vi.fn(() => Promise.resolve([{ id: 'nation-1' }]))
          }))
        })),
        update: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn(() => Promise.resolve())
          }))
        }))
      }
      return callback(mockTx)
    }),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([{ id: 'nation-1' }])) })) })),
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => Promise.resolve([{ balance: 20000 }])) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    execute: vi.fn(() => Promise.resolve()),
  }
}))

describe('createNationFormAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when user is not authenticated', async () => {
    // Override mock for this test
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as any).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null }))
      }
    })

    const { createNationFormAction } = await import('./createNationForm.action')

    const formData = new FormData()
    formData.set('name', 'Test Nation')
    formData.set('description', 'A test nation')
    formData.set('nationType', 'creative')
    formData.set('vision', 'Test vision')
    formData.set('rules', 'Test rules')
    formData.set('agreeOasis', 'true')
    formData.set('agreeTerms', 'true')

    const result = await createNationFormAction(formData)

    expect(result.success).toBe(false)
    expect(result.error).toContain('認証')
  })

  it('returns error when required fields are missing', async () => {
    const { createNationFormAction } = await import('./createNationForm.action')

    const formData = new FormData()
    // Missing name
    formData.set('description', 'A test nation')

    const result = await createNationFormAction(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('returns error when oasis agreement is not checked', async () => {
    const { createNationFormAction } = await import('./createNationForm.action')

    const formData = new FormData()
    formData.set('name', 'Test Nation')
    formData.set('description', 'A test nation')
    formData.set('nationType', 'creative')
    formData.set('vision', 'Test vision')
    formData.set('rules', 'Test rules')
    formData.set('agreeTerms', 'true')
    // Missing agreeOasis

    const result = await createNationFormAction(formData)

    expect(result.success).toBe(false)
    expect(result.error).toContain('オアシス宣言')
  })

  it('returns error when terms agreement is not checked', async () => {
    const { createNationFormAction } = await import('./createNationForm.action')

    const formData = new FormData()
    formData.set('name', 'Test Nation')
    formData.set('description', 'A test nation')
    formData.set('nationType', 'creative')
    formData.set('vision', 'Test vision')
    formData.set('rules', 'Test rules')
    formData.set('agreeOasis', 'true')
    // Missing agreeTerms

    const result = await createNationFormAction(formData)

    expect(result.success).toBe(false)
    expect(result.error).toContain('建国規約')
  })

  it('returns error when root account is not found', async () => {
    const db = await import('@/lib/db')
    ;(db.db.query.rootAccounts.findFirst as any).mockResolvedValueOnce(null)

    const { createNationFormAction } = await import('./createNationForm.action')

    const formData = new FormData()
    formData.set('name', 'Test Nation')
    formData.set('description', 'A test nation')
    formData.set('nationType', 'creative')
    formData.set('vision', 'Test vision')
    formData.set('rules', 'Test rules')
    formData.set('agreeOasis', 'true')
    formData.set('agreeTerms', 'true')

    const result = await createNationFormAction(formData)

    expect(result.success).toBe(false)
    expect(result.error).toContain('ルートアカウント')
  })

  it('returns success with nationId when all validations pass', async () => {
    const db = await import('@/lib/db')
    ;(db.db.query.rootAccounts.findFirst as any).mockResolvedValueOnce({ id: 'root-1', userId: 'user-123' })
    ;(db.db.query.profiles.findFirst as any).mockResolvedValueOnce({ id: 'profile-1' })
    ;(db.db.query.rootAccountPoints.findFirst as any).mockResolvedValueOnce({ balance: 20000 })

    const { createNationFormAction } = await import('./createNationForm.action')

    const formData = new FormData()
    formData.set('name', 'Test Nation')
    formData.set('description', 'A test nation')
    formData.set('nationType', 'creative')
    formData.set('vision', 'Test vision')
    formData.set('rules', 'Test rules')
    formData.set('agreeOasis', 'true')
    formData.set('agreeTerms', 'true')

    const result = await createNationFormAction(formData)

    expect(result.success).toBe(true)
    expect(result.nationId).toBeDefined()
  })
})
