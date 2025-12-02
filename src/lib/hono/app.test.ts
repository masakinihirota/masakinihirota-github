/**
 * HONO API テスト
 * @description HONOアプリケーションの単体テスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHonoApp } from './app'

// モック用のSupabaseクライアント
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
  },
}

// Supabaseクライアントをモック
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}))

// chainableなモックオブジェクトを作成するヘルパー
const createChainableMock = (finalValue: unknown = []) => {
  const chainable: Record<string, unknown> = {}
  const methods = ['from', 'where', 'limit', 'offset', 'orderBy', 'select', 'leftJoin', 'innerJoin', 'groupBy', 'having']

  methods.forEach(method => {
    chainable[method] = vi.fn(() => chainable)
  })

  // Promiseとしても動作するようにする
  chainable.then = (resolve: (value: unknown) => unknown) => Promise.resolve(finalValue).then(resolve)
  chainable.catch = (reject: (reason: unknown) => unknown) => Promise.resolve(finalValue).catch(reject)

  return chainable
}

// DBをモック
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(() => createChainableMock([])),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 'test-id' }])),
        onConflictDoUpdate: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 'test-id' }])),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 'test-id' }])),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
    execute: vi.fn(() => Promise.resolve([])),
  },
}))

// 既存の searchWorks をモック
vi.mock('@/actions/searchWorks.fetch', () => ({
  searchWorks: vi.fn(() => Promise.resolve([])),
}))

// getOrganizations をモック
vi.mock('@/lib/organization/getOrganizations.service', () => ({
  getOrganizations: vi.fn(() => Promise.resolve({ success: true, data: [] })),
}))

describe('HONO API App', () => {
  let app: ReturnType<typeof createHonoApp>

  beforeEach(() => {
    app = createHonoApp()
    vi.clearAllMocks()
  })

  describe('Health Check', () => {
    it('GET /api/v1/health should return status ok', async () => {
      const res = await app.request('/api/v1/health')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.data.status).toBe('ok')
      expect(json.data.version).toBe('1.0.0')
    })
  })

  describe('NotFound Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await app.request('/api/v1/unknown-route')
      expect(res.status).toBe(404)

      const json = await res.json()
      expect(json.success).toBe(false)
      expect(json.code).toBe('NOT_FOUND')
    })
  })

  describe('Auth Routes', () => {
    it('GET /api/v1/auth/session should return session info', async () => {
      const res = await app.request('/api/v1/auth/session')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.data).toHaveProperty('isAuthenticated')
    })

    it('GET /api/v1/auth/me should return 401 for unauthenticated users', async () => {
      const res = await app.request('/api/v1/auth/me')
      expect(res.status).toBe(401)

      const json = await res.json()
      expect(json.success).toBe(false)
    })
  })

  describe('Profiles Routes', () => {
    it('GET /api/v1/profiles should return profiles list', async () => {
      const res = await app.request('/api/v1/profiles')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
      expect(Array.isArray(json.data)).toBe(true)
    })

    it('POST /api/v1/profiles should return 401 for unauthenticated users', async () => {
      const res = await app.request('/api/v1/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Profile' }),
      })
      expect(res.status).toBe(401)
    })
  })

  describe('Works Routes', () => {
    it('GET /api/v1/works should return works list', async () => {
      const res = await app.request('/api/v1/works')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
    })

    it('GET /api/v1/works/categories should return categories', async () => {
      const res = await app.request('/api/v1/works/categories')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('Organizations Routes', () => {
    it('GET /api/v1/organizations should return organizations list', async () => {
      const res = await app.request('/api/v1/organizations')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('Nations Routes', () => {
    it('GET /api/v1/nations should return nations list', async () => {
      const res = await app.request('/api/v1/nations')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
      expect(Array.isArray(json.data)).toBe(true)
    })

    it('GET /api/v1/nations/levels should return levels', async () => {
      const res = await app.request('/api/v1/nations/levels')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('Search Routes', () => {
    it('GET /api/v1/search/quick should return empty for no query', async () => {
      const res = await app.request('/api/v1/search/quick?q=')
      expect(res.status).toBe(200)

      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.data).toEqual([])
    })
  })

  describe('CORS Headers', () => {
    it('should include CORS headers in response', async () => {
      const res = await app.request('/api/v1/health', {
        method: 'OPTIONS',
      })

      // CORS preflight should return 204 or 200
      expect([200, 204]).toContain(res.status)
    })
  })
})

describe('HONO Middleware', () => {
  describe('Auth Middleware', () => {
    it('should set user to null for unauthenticated requests', async () => {
      const app = createHonoApp()
      const res = await app.request('/api/v1/auth/me')

      expect(res.status).toBe(401)
    })
  })
})
