/**
 * Profiles API ルート
 * @description プロフィール関連のCRUD操作
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { profiles, profileLinks, rootAccounts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createProfile } from '@/actions/createProfile.fetch'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth, requireProfile } from '@/lib/hono/middleware'

const profilesRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const createProfileSchema = z.object({
  name: z.string().min(1, 'プロフィール名は必須です').max(100),
  bio: z.string().max(500).optional(),
  links: z.array(z.object({
    url: z.string().url('有効なURLを入力してください'),
    label: z.string().max(50).optional(),
    type: z.string().max(50).optional(),
  })).optional(),
})

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  links: z.array(z.object({
    url: z.string().url(),
    label: z.string().max(50).optional(),
    type: z.string().max(50).optional(),
  })).optional(),
})

/**
 * GET /profiles
 * 全プロフィール一覧を取得（公開用）
 */
profilesRouter.get('/', async (c) => {
  try {
    const profileList = await db
      .select({
        id: profiles.id,
        name: profiles.name,
        bio: profiles.bio,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .limit(100)

    return c.json({ success: true, data: profileList })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /profiles/me
 * 現在のユーザーのプロフィールを取得
 */
profilesRouter.get('/me', requireAuth, async (c) => {
  try {
    const profileId = c.get('profileId')
    const rootAccountId = c.get('rootAccountId')

    if (!profileId || !rootAccountId) {
      return c.json({ success: false, error: 'プロフィールが存在しません' }, 404)
    }

    // プロフィールとリンクを取得
    const profileResult = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1)

    if (profileResult.length === 0) {
      return c.json({ success: false, error: 'プロフィールが見つかりません' }, 404)
    }

    const linksResult = await db
      .select()
      .from(profileLinks)
      .where(eq(profileLinks.profileId, profileId))

    return c.json({
      success: true,
      data: {
        ...profileResult[0],
        links: linksResult,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /profiles/:id
 * 特定のプロフィールを取得
 */
profilesRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const profileResult = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1)

    if (profileResult.length === 0) {
      return c.json({ success: false, error: 'プロフィールが見つかりません' }, 404)
    }

    const linksResult = await db
      .select()
      .from(profileLinks)
      .where(eq(profileLinks.profileId, id))

    return c.json({
      success: true,
      data: {
        ...profileResult[0],
        links: linksResult,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /profiles
 * 新しいプロフィールを作成
 */
profilesRouter.post(
  '/',
  requireAuth,
  zValidator('json', createProfileSchema),
  async (c) => {
    try {
      const user = c.get('user')
      const rootAccountId = c.get('rootAccountId')
      const body = c.req.valid('json')

      if (!user || !rootAccountId) {
        return c.json({ success: false, error: '認証が必要です' }, 401)
      }

      const ctx = { session: { user: { id: user.id } } }
      // createProfile expects rootAccountId in payload
      const payload = {
        rootAccountId,
        name: body.name,
        bio: body.bio,
        links: body.links,
      }
      const result = await createProfile(payload, ctx)

      return c.json({ success: true, data: result }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * PATCH /profiles/:id
 * プロフィールを更新
 */
profilesRouter.patch(
  '/:id',
  requireAuth,
  zValidator('json', updateProfileSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      // 自分のプロフィールのみ更新可能
      if (id !== profileId) {
        return c.json({ success: false, error: '権限がありません' }, 403)
      }

      // プロフィール更新
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }
      if (body.name) updateData.name = body.name
      if (body.bio !== undefined) updateData.bio = body.bio

      await db
        .update(profiles)
        .set(updateData)
        .where(eq(profiles.id, id))

      // リンクの更新（あれば）
      if (body.links) {
        // 既存リンクを削除
        await db.delete(profileLinks).where(eq(profileLinks.profileId, id))

        // 新しいリンクを追加
        if (body.links.length > 0) {
          await db.insert(profileLinks).values(
            body.links.map((link) => ({
              profileId: id,
              url: link.url,
              label: link.label ?? null,
              type: link.type ?? null,
            }))
          )
        }
      }

      // 更新後のデータを取得
      const updatedProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, id))
        .limit(1)

      const updatedLinks = await db
        .select()
        .from(profileLinks)
        .where(eq(profileLinks.profileId, id))

      return c.json({
        success: true,
        data: {
          ...updatedProfile[0],
          links: updatedLinks,
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * DELETE /profiles/:id
 * プロフィールを削除
 */
profilesRouter.delete('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const profileId = c.get('profileId')
    const rootAccountId = c.get('rootAccountId')

    // 自分のプロフィールのみ削除可能
    if (id !== profileId) {
      return c.json({ success: false, error: '権限がありません' }, 403)
    }

    // プロフィール数を確認（最低1つは必要）
    if (rootAccountId) {
      const profileCount = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.rootAccountId, rootAccountId))

      if (profileCount.length <= 1) {
        return c.json({ success: false, error: '最後のプロフィールは削除できません' }, 400)
      }
    }

    await db.delete(profiles).where(eq(profiles.id, id))

    return c.json({ success: true, data: { deleted: id } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { profilesRouter }
