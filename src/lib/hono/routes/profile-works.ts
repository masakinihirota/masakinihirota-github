/**
 * Profile-Works API ルート
 * @description プロフィールと作品の関連付け（評価、ステータス管理）
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { profileWorks, works } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { upsertProfileWork } from '@/actions/upsertProfileWork.fetch'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth, requireProfile } from '@/lib/hono/middleware'

const profileWorksRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const upsertProfileWorkSchema = z.object({
  workId: z.string().uuid('有効な作品IDを入力してください'),
  status: z.enum(['now', 'life', 'future']).optional(),
  tier: z.number().int().min(0).max(3).optional(),
  claps: z.number().int().min(0).optional(),
  liked: z.boolean().optional(),
})

const updateProfileWorkSchema = z.object({
  status: z.enum(['now', 'life', 'future']).optional(),
  tier: z.number().int().min(0).max(3).optional(),
  claps: z.number().int().min(0).optional(),
  liked: z.boolean().optional(),
})

/**
 * GET /profile-works
 * 現在のプロフィールの作品一覧を取得
 */
profileWorksRouter.get('/', requireAuth, requireProfile, async (c) => {
  try {
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    const workList = await db
      .select({
        workId: profileWorks.workId,
        status: profileWorks.status,
        tier: profileWorks.tier,
        claps: profileWorks.claps,
        liked: profileWorks.liked,
        createdAt: profileWorks.createdAt,
        title: works.title,
        categoryId: works.categoryId,
        description: works.description,
      })
      .from(profileWorks)
      .leftJoin(works, eq(profileWorks.workId, works.id))
      .where(eq(profileWorks.profileId, profileId))

    return c.json({ success: true, data: workList })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /profile-works/:profileId
 * 特定プロフィールの作品一覧を取得（公開用）
 */
profileWorksRouter.get('/:profileId', async (c) => {
  try {
    const profileId = c.req.param('profileId')

    const workList = await db
      .select({
        workId: profileWorks.workId,
        status: profileWorks.status,
        tier: profileWorks.tier,
        claps: profileWorks.claps,
        liked: profileWorks.liked,
        createdAt: profileWorks.createdAt,
        title: works.title,
        categoryId: works.categoryId,
        description: works.description,
      })
      .from(profileWorks)
      .leftJoin(works, eq(profileWorks.workId, works.id))
      .where(eq(profileWorks.profileId, profileId))

    return c.json({ success: true, data: workList })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /profile-works/work/:workId
 * 特定作品に対する現在のプロフィールの評価を取得
 */
profileWorksRouter.get('/work/:workId', requireAuth, requireProfile, async (c) => {
  try {
    const workId = c.req.param('workId')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    const result = await db
      .select()
      .from(profileWorks)
      .where(
        and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        )
      )
      .limit(1)

    if (result.length === 0) {
      return c.json({ success: true, data: null })
    }

    return c.json({ success: true, data: result[0] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /profile-works
 * 作品を追加または更新（upsert）
 */
profileWorksRouter.post(
  '/',
  requireAuth,
  requireProfile,
  zValidator('json', upsertProfileWorkSchema),
  async (c) => {
    try {
      const user = c.get('user')
      const body = c.req.valid('json')

      if (!user) {
        return c.json({ success: false, error: '認証が必要です' }, 401)
      }

      const ctx = { session: { user: { id: user.id } } }
      const result = await upsertProfileWork(body, ctx)

      return c.json({ success: true, data: result }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * PATCH /profile-works/:workId
 * 作品の評価を更新
 */
profileWorksRouter.patch(
  '/:workId',
  requireAuth,
  requireProfile,
  zValidator('json', updateProfileWorkSchema),
  async (c) => {
    try {
      const workId = c.req.param('workId')
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      if (!profileId) {
        return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
      }

      // 既存レコードの確認
      const existing = await db
        .select()
        .from(profileWorks)
        .where(
          and(
            eq(profileWorks.profileId, profileId),
            eq(profileWorks.workId, workId)
          )
        )
        .limit(1)

      if (existing.length === 0) {
        return c.json({ success: false, error: '作品が見つかりません' }, 404)
      }

      // 更新
      const updateData: Record<string, unknown> = {}
      if (body.status !== undefined) updateData.status = body.status
      if (body.tier !== undefined) updateData.tier = body.tier
      if (body.claps !== undefined) updateData.claps = body.claps
      if (body.liked !== undefined) updateData.liked = body.liked

      await db
        .update(profileWorks)
        .set(updateData)
        .where(
          and(
            eq(profileWorks.profileId, profileId),
            eq(profileWorks.workId, workId)
          )
        )

      // 更新後のデータを取得
      const updated = await db
        .select()
        .from(profileWorks)
        .where(
          and(
            eq(profileWorks.profileId, profileId),
            eq(profileWorks.workId, workId)
          )
        )
        .limit(1)

      return c.json({ success: true, data: updated[0] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * DELETE /profile-works/:workId
 * 作品を削除
 */
profileWorksRouter.delete('/:workId', requireAuth, requireProfile, async (c) => {
  try {
    const workId = c.req.param('workId')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    await db
      .delete(profileWorks)
      .where(
        and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        )
      )

    return c.json({ success: true, data: { deleted: workId } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /profile-works/:workId/clap
 * 作品に拍手を送る
 */
profileWorksRouter.post('/:workId/clap', requireAuth, requireProfile, async (c) => {
  try {
    const workId = c.req.param('workId')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    // 既存レコードの確認
    const existing = await db
      .select({ claps: profileWorks.claps })
      .from(profileWorks)
      .where(
        and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        )
      )
      .limit(1)

    if (existing.length === 0) {
      // 新規作成
      await db.insert(profileWorks).values({
        profileId,
        workId,
        claps: 1,
      })
    } else {
      // 拍手を増やす（最大50）
      const newClaps = Math.min((existing[0].claps ?? 0) + 1, 50)
      await db
        .update(profileWorks)
        .set({ claps: newClaps })
        .where(
          and(
            eq(profileWorks.profileId, profileId),
            eq(profileWorks.workId, workId)
          )
        )
    }

    // 更新後のデータを取得
    const updated = await db
      .select()
      .from(profileWorks)
      .where(
        and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        )
      )
      .limit(1)

    return c.json({ success: true, data: updated[0] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /profile-works/:workId/like
 * 作品にいいねを切り替える
 */
profileWorksRouter.post('/:workId/like', requireAuth, requireProfile, async (c) => {
  try {
    const workId = c.req.param('workId')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    // 既存レコードの確認
    const existing = await db
      .select({ liked: profileWorks.liked })
      .from(profileWorks)
      .where(
        and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        )
      )
      .limit(1)

    if (existing.length === 0) {
      // 新規作成
      await db.insert(profileWorks).values({
        profileId,
        workId,
        liked: true,
      })
    } else {
      // いいねをトグル
      await db
        .update(profileWorks)
        .set({ liked: !existing[0].liked })
        .where(
          and(
            eq(profileWorks.profileId, profileId),
            eq(profileWorks.workId, workId)
          )
        )
    }

    // 更新後のデータを取得
    const updated = await db
      .select()
      .from(profileWorks)
      .where(
        and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        )
      )
      .limit(1)

    return c.json({ success: true, data: updated[0] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { profileWorksRouter }
