/**
 * Nations API ルート
 * @description 国家関連のCRUD操作
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { nations, nationMemberships, nationLevels, organizations } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { createNation } from '@/actions/createNation.fetch'
import { joinNation } from '@/actions/joinNation.fetch'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth, requireProfile } from '@/lib/hono/middleware'

const nationsRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const createNationSchema = z.object({
  name: z.string().min(1, '国名は必須です').max(100),
  description: z.string().max(2000).optional(),
  levelId: z.string().default('Village'),
})

const updateNationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  levelId: z.string().optional(),
})

const joinNationSchema = z.object({
  organizationId: z.string().uuid('有効な組織IDを入力してください'),
})

/**
 * GET /nations
 * 国家一覧を取得
 */
nationsRouter.get('/', async (c) => {
  try {
    const nationList = await db
      .select({
        id: nations.id,
        name: nations.name,
        description: nations.description,
        levelId: nations.levelId,
        leaderOrganizationId: nations.leaderOrganizationId,
        createdAt: nations.createdAt,
      })
      .from(nations)
      .limit(100)

    return c.json({ success: true, data: nationList })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /nations/levels
 * 国家レベル一覧を取得
 */
nationsRouter.get('/levels', async (c) => {
  try {
    const levels = await db.select().from(nationLevels)
    return c.json({ success: true, data: levels })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /nations/:id
 * 特定の国家を取得
 */
nationsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const nationResult = await db
      .select()
      .from(nations)
      .where(eq(nations.id, id))
      .limit(1)

    if (nationResult.length === 0) {
      return c.json({ success: false, error: '国家が見つかりません' }, 404)
    }

    // 所属組織一覧も取得
    const memberships = await db
      .select({
        organizationId: nationMemberships.organizationId,
        joinedAt: nationMemberships.joinedAt,
        organizationName: organizations.name,
      })
      .from(nationMemberships)
      .leftJoin(organizations, eq(nationMemberships.organizationId, organizations.id))
      .where(eq(nationMemberships.nationId, id))

    return c.json({
      success: true,
      data: {
        ...nationResult[0],
        memberships,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /nations/:id/organizations
 * 国家に所属する組織一覧を取得
 */
nationsRouter.get('/:id/organizations', async (c) => {
  try {
    const id = c.req.param('id')

    const orgList = await db
      .select({
        organizationId: nationMemberships.organizationId,
        joinedAt: nationMemberships.joinedAt,
        name: organizations.name,
        description: organizations.description,
      })
      .from(nationMemberships)
      .leftJoin(organizations, eq(nationMemberships.organizationId, organizations.id))
      .where(eq(nationMemberships.nationId, id))

    return c.json({ success: true, data: orgList })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /nations
 * 新しい国家を作成
 */
nationsRouter.post(
  '/',
  requireAuth,
  requireProfile,
  zValidator('json', createNationSchema),
  async (c) => {
    try {
      const user = c.get('user')
      const profileId = c.get('profileId')
      const rootAccountId = c.get('rootAccountId')
      const body = c.req.valid('json')

      if (!user || !profileId || !rootAccountId) {
        return c.json({ success: false, error: '認証が必要です' }, 401)
      }

      // createNation expects rootAccountId, name, cost, and optionally creatorProfileId
      const payload = {
        rootAccountId,
        name: body.name,
        cost: 100, // Default cost for nation creation
        creatorProfileId: profileId,
      }
      const result = await createNation(payload)

      return c.json({ success: true, data: result }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * PATCH /nations/:id
 * 国家を更新
 */
nationsRouter.patch(
  '/:id',
  requireAuth,
  requireProfile,
  zValidator('json', updateNationSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      // 国家を取得してリーダー組織を確認
      const nationResult = await db
        .select({ leaderOrganizationId: nations.leaderOrganizationId })
        .from(nations)
        .where(eq(nations.id, id))
        .limit(1)

      if (nationResult.length === 0) {
        return c.json({ success: false, error: '国家が見つかりません' }, 404)
      }

      // リーダー組織のリーダーか確認
      if (nationResult[0].leaderOrganizationId && profileId) {
        const leaderOrg = await db
          .select({ leaderProfileId: organizations.leaderProfileId })
          .from(organizations)
          .where(eq(organizations.id, nationResult[0].leaderOrganizationId))
          .limit(1)

        if (leaderOrg.length === 0 || leaderOrg[0].leaderProfileId !== profileId) {
          return c.json({ success: false, error: '権限がありません' }, 403)
        }
      }

      // 更新
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }
      if (body.name) updateData.name = body.name
      if (body.description !== undefined) updateData.description = body.description
      if (body.levelId) updateData.levelId = body.levelId

      await db.update(nations).set(updateData).where(eq(nations.id, id))

      // 更新後のデータを取得
      const updated = await db
        .select()
        .from(nations)
        .where(eq(nations.id, id))
        .limit(1)

      return c.json({ success: true, data: updated[0] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * DELETE /nations/:id
 * 国家を削除
 */
nationsRouter.delete('/:id', requireAuth, requireProfile, async (c) => {
  try {
    const id = c.req.param('id')
    const profileId = c.get('profileId')

    // 国家を取得してリーダー組織を確認
    const nationResult = await db
      .select({ leaderOrganizationId: nations.leaderOrganizationId })
      .from(nations)
      .where(eq(nations.id, id))
      .limit(1)

    if (nationResult.length === 0) {
      return c.json({ success: false, error: '国家が見つかりません' }, 404)
    }

    // リーダー組織のリーダーか確認
    if (nationResult[0].leaderOrganizationId && profileId) {
      const leaderOrg = await db
        .select({ leaderProfileId: organizations.leaderProfileId })
        .from(organizations)
        .where(eq(organizations.id, nationResult[0].leaderOrganizationId))
        .limit(1)

      if (leaderOrg.length === 0 || leaderOrg[0].leaderProfileId !== profileId) {
        return c.json({ success: false, error: '権限がありません' }, 403)
      }
    }

    await db.delete(nations).where(eq(nations.id, id))

    return c.json({ success: true, data: { deleted: id } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /nations/:id/join
 * 組織を国家に参加させる
 */
nationsRouter.post(
  '/:id/join',
  requireAuth,
  requireProfile,
  zValidator('json', joinNationSchema),
  async (c) => {
    try {
      const nationId = c.req.param('id')
      const user = c.get('user')
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      if (!user || !profileId) {
        return c.json({ success: false, error: '認証が必要です' }, 401)
      }

      // 組織のリーダーか確認
      const orgResult = await db
        .select({ leaderProfileId: organizations.leaderProfileId })
        .from(organizations)
        .where(eq(organizations.id, body.organizationId))
        .limit(1)

      if (orgResult.length === 0) {
        return c.json({ success: false, error: '組織が見つかりません' }, 404)
      }

      if (orgResult[0].leaderProfileId !== profileId) {
        return c.json({ success: false, error: '組織のリーダーのみが国家に参加できます' }, 403)
      }

      // joinNation expects nationId, organizationId, and requesterProfileId
      const result = await joinNation({
        nationId,
        organizationId: body.organizationId,
        requesterProfileId: profileId,
      })

      return c.json({ success: true, data: result }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * POST /nations/:id/leave
 * 組織を国家から脱退させる
 */
nationsRouter.post(
  '/:id/leave',
  requireAuth,
  requireProfile,
  zValidator('json', joinNationSchema),
  async (c) => {
    try {
      const nationId = c.req.param('id')
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      if (!profileId) {
        return c.json({ success: false, error: '認証が必要です' }, 401)
      }

      // 組織のリーダーか確認
      const orgResult = await db
        .select({ leaderProfileId: organizations.leaderProfileId })
        .from(organizations)
        .where(eq(organizations.id, body.organizationId))
        .limit(1)

      if (orgResult.length === 0) {
        return c.json({ success: false, error: '組織が見つかりません' }, 404)
      }

      if (orgResult[0].leaderProfileId !== profileId) {
        return c.json({ success: false, error: '組織のリーダーのみが脱退できます' }, 403)
      }

      // リーダー組織は脱退できない
      const nationResult = await db
        .select({ leaderOrganizationId: nations.leaderOrganizationId })
        .from(nations)
        .where(eq(nations.id, nationId))
        .limit(1)

      if (nationResult.length === 0) {
        return c.json({ success: false, error: '国家が見つかりません' }, 404)
      }

      if (nationResult[0].leaderOrganizationId === body.organizationId) {
        return c.json({ success: false, error: 'リーダー組織は脱退できません' }, 400)
      }

      await db
        .delete(nationMemberships)
        .where(
          and(
            eq(nationMemberships.nationId, nationId),
            eq(nationMemberships.organizationId, body.organizationId)
          )
        )

      return c.json({ success: true, data: { left: nationId } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

export { nationsRouter }
