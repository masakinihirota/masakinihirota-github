/**
 * Works API ルート
 * @description 作品関連のCRUD操作
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { works, workAggregates, workCategories } from '@/db/schema'
import { eq, ilike, or, desc, asc } from 'drizzle-orm'
import { createWork } from '@/actions/createWork.fetch'
import { searchWorks } from '@/actions/searchWorks.fetch'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth } from '@/lib/hono/middleware'

const worksRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const createWorkSchema = z.object({
  title: z.string().min(1, '作品タイトルは必須です').max(200),
  categoryId: z.string().min(1, 'カテゴリは必須です'),
  description: z.string().max(2000).optional(),
  authors: z.array(z.string()).optional(),
  releaseYear: z.number().int().min(1900).max(2100).optional(),
  genres: z.array(z.string()).optional(),
  introUrl: z.string().url().optional().nullable(),
  affiliateUrl: z.string().url().optional().nullable(),
  size: z.string().max(50).optional(),
})

const updateWorkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  categoryId: z.string().optional(),
  description: z.string().max(2000).optional(),
  authors: z.array(z.string()).optional(),
  releaseYear: z.number().int().min(1900).max(2100).optional(),
  genres: z.array(z.string()).optional(),
  introUrl: z.string().url().optional().nullable(),
  affiliateUrl: z.string().url().optional().nullable(),
  size: z.string().max(50).optional(),
})

const searchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['title', 'releaseYear', 'avgScore', 'createdAt']).default('title'),
  order: z.enum(['asc', 'desc']).default('asc'),
})

/**
 * GET /works
 * 作品一覧を取得（検索・ページネーション対応）
 */
worksRouter.get(
  '/',
  zValidator('query', searchQuerySchema),
  async (c) => {
    try {
      const query = c.req.valid('query')
      const { q, categoryId, page, limit, sort, order } = query

      // 検索クエリがある場合は既存の検索関数を使用
      if (q && q.trim().length > 0) {
        const result = await searchWorks({ q })
        return c.json({ success: true, data: result })
      }

      // 基本クエリ
      let workList = await db
        .select({
          id: works.id,
          title: works.title,
          categoryId: works.categoryId,
          description: works.description,
          authors: works.authors,
          releaseYear: works.releaseYear,
          genres: works.genres,
          introUrl: works.introUrl,
          approved: works.approved,
        })
        .from(works)
        .where(categoryId ? eq(works.categoryId, categoryId) : undefined)
        .orderBy(order === 'desc' ? desc(works.title) : asc(works.title))
        .limit(limit)
        .offset((page - 1) * limit)

      return c.json({
        success: true,
        data: workList,
        pagination: {
          page,
          limit,
          hasMore: workList.length === limit,
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * GET /works/categories
 * 作品カテゴリ一覧を取得
 */
worksRouter.get('/categories', async (c) => {
  try {
    const categories = await db.select().from(workCategories)
    return c.json({ success: true, data: categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /works/:id
 * 特定の作品を取得
 */
worksRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const workResult = await db
      .select()
      .from(works)
      .where(eq(works.id, id))
      .limit(1)

    if (workResult.length === 0) {
      return c.json({ success: false, error: '作品が見つかりません' }, 404)
    }

    // 集計情報も取得
    const aggregateResult = await db
      .select()
      .from(workAggregates)
      .where(eq(workAggregates.workId, id))
      .limit(1)

    return c.json({
      success: true,
      data: {
        ...workResult[0],
        aggregates: aggregateResult[0] ?? null,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /works
 * 新しい作品を作成
 */
worksRouter.post(
  '/',
  requireAuth,
  zValidator('json', createWorkSchema),
  async (c) => {
    try {
      const user = c.get('user')
      const body = c.req.valid('json')

      if (!user) {
        return c.json({ success: false, error: '認証が必要です' }, 401)
      }

      const ctx = { session: { user: { id: user.id } } }
      const result = await createWork(body, ctx)

      return c.json({ success: true, data: result }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * PATCH /works/:id
 * 作品を更新
 */
worksRouter.patch(
  '/:id',
  requireAuth,
  zValidator('json', updateWorkSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const rootAccountId = c.get('rootAccountId')
      const body = c.req.valid('json')

      // 作品の作成者を確認
      const workResult = await db
        .select({ createdBy: works.createdBy })
        .from(works)
        .where(eq(works.id, id))
        .limit(1)

      if (workResult.length === 0) {
        return c.json({ success: false, error: '作品が見つかりません' }, 404)
      }

      // 作成者のみ更新可能（または未承認の場合）
      if (workResult[0].createdBy !== rootAccountId) {
        return c.json({ success: false, error: '権限がありません' }, 403)
      }

      // 更新データを構築
      const updateData: Record<string, unknown> = {}
      if (body.title) updateData.title = body.title
      if (body.categoryId) updateData.categoryId = body.categoryId
      if (body.description !== undefined) updateData.description = body.description
      if (body.authors) updateData.authors = body.authors
      if (body.releaseYear !== undefined) updateData.releaseYear = body.releaseYear
      if (body.genres) updateData.genres = body.genres
      if (body.introUrl !== undefined) updateData.introUrl = body.introUrl
      if (body.affiliateUrl !== undefined) updateData.affiliateUrl = body.affiliateUrl
      if (body.size !== undefined) updateData.size = body.size

      await db.update(works).set(updateData).where(eq(works.id, id))

      // 更新後のデータを取得
      const updatedWork = await db
        .select()
        .from(works)
        .where(eq(works.id, id))
        .limit(1)

      return c.json({ success: true, data: updatedWork[0] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * DELETE /works/:id
 * 作品を削除
 */
worksRouter.delete('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const rootAccountId = c.get('rootAccountId')

    // 作品の作成者を確認
    const workResult = await db
      .select({ createdBy: works.createdBy, approved: works.approved })
      .from(works)
      .where(eq(works.id, id))
      .limit(1)

    if (workResult.length === 0) {
      return c.json({ success: false, error: '作品が見つかりません' }, 404)
    }

    // 作成者のみ削除可能、かつ未承認の場合のみ
    if (workResult[0].createdBy !== rootAccountId) {
      return c.json({ success: false, error: '権限がありません' }, 403)
    }

    if (workResult[0].approved) {
      return c.json({ success: false, error: '承認済みの作品は削除できません' }, 400)
    }

    await db.delete(works).where(eq(works.id, id))

    return c.json({ success: true, data: { deleted: id } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { worksRouter }
