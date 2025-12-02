/**
 * Search API ルート
 * @description 検索関連のAPI
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { works, profiles, organizations, nations } from '@/db/schema'
import { ilike, or } from 'drizzle-orm'
import { searchWorks } from '@/actions/searchWorks.fetch'
import type { AppEnv } from '@/lib/hono/types'

const searchRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const searchQuerySchema = z.object({
  q: z.string().min(1, '検索キーワードは必須です').max(200),
  type: z.enum(['all', 'works', 'profiles', 'organizations', 'nations']).default('all'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

const quickSearchSchema = z.object({
  q: z.string().max(200),
})

/**
 * GET /search
 * 統合検索
 */
searchRouter.get('/', zValidator('query', searchQuerySchema), async (c) => {
  try {
    const { q, type, limit } = c.req.valid('query')
    const query = `%${q}%`

    const results: Record<string, unknown[]> = {}

    // 作品検索
    if (type === 'all' || type === 'works') {
      const workResults = await searchWorks({ q })
      results.works = workResults.slice(0, limit)
    }

    // プロフィール検索
    if (type === 'all' || type === 'profiles') {
      const profileResults = await db
        .select({
          id: profiles.id,
          name: profiles.name,
          bio: profiles.bio,
        })
        .from(profiles)
        .where(or(ilike(profiles.name, query), ilike(profiles.bio, query)))
        .limit(limit)
      results.profiles = profileResults.map(p => ({ ...p, type: 'profile' }))
    }

    // 組織検索
    if (type === 'all' || type === 'organizations') {
      const orgResults = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          description: organizations.description,
        })
        .from(organizations)
        .where(or(ilike(organizations.name, query), ilike(organizations.description, query)))
        .limit(limit)
      results.organizations = orgResults.map(o => ({ ...o, type: 'organization' }))
    }

    // 国家検索
    if (type === 'all' || type === 'nations') {
      const nationResults = await db
        .select({
          id: nations.id,
          name: nations.name,
          description: nations.description,
        })
        .from(nations)
        .where(or(ilike(nations.name, query), ilike(nations.description, query)))
        .limit(limit)
      results.nations = nationResults.map(n => ({ ...n, type: 'nation' }))
    }

    return c.json({ success: true, data: results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /search/quick
 * クイック検索（オートコンプリート用）
 */
searchRouter.get('/quick', zValidator('query', quickSearchSchema), async (c) => {
  try {
    const { q } = c.req.valid('query')

    if (!q || q.trim().length === 0) {
      return c.json({ success: true, data: [] })
    }

    const query = `%${q}%`
    const results: Array<{ id: string; title: string; type: string }> = []

    // 作品から検索
    const workResults = await db
      .select({ id: works.id, title: works.title })
      .from(works)
      .where(ilike(works.title, query))
      .limit(5)

    for (const work of workResults) {
      results.push({ id: work.id, title: work.title, type: 'work' })
    }

    // プロフィールから検索
    const profileResults = await db
      .select({ id: profiles.id, name: profiles.name })
      .from(profiles)
      .where(ilike(profiles.name, query))
      .limit(5)

    for (const profile of profileResults) {
      results.push({ id: profile.id, title: profile.name, type: 'profile' })
    }

    // 組織から検索
    const orgResults = await db
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations)
      .where(ilike(organizations.name, query))
      .limit(5)

    for (const org of orgResults) {
      results.push({ id: org.id, title: org.name, type: 'organization' })
    }

    return c.json({ success: true, data: results.slice(0, 10) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /search/works
 * 作品検索（POST版）
 */
searchRouter.post('/works', zValidator('json', quickSearchSchema), async (c) => {
  try {
    const { q } = c.req.valid('json')

    if (!q || q.trim().length === 0) {
      return c.json({ success: true, data: [] })
    }

    const result = await searchWorks({ q })
    return c.json({ success: true, data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { searchRouter }
