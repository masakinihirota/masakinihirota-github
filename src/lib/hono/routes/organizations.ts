/**
 * Organizations API ルート
 * @description 組織関連のCRUD操作
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { organizations, organizationMembers, profiles } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { createOrganization } from '@/lib/organization/createOrganization.service'
import { getOrganizations } from '@/lib/organization/getOrganizations.service'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth, requireProfile } from '@/lib/hono/middleware'

const organizationsRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const createOrganizationSchema = z.object({
  name: z.string().min(1, '組織名は必須です').max(100),
  description: z.string().max(1000).optional(),
})

const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
})

const addMemberSchema = z.object({
  profileId: z.string().uuid('有効なプロフィールIDを入力してください'),
  roleId: z.string().default('member'),
})

/**
 * GET /organizations
 * 組織一覧を取得
 */
organizationsRouter.get('/', async (c) => {
  try {
    const result = await getOrganizations()

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 500)
    }

    return c.json({ success: true, data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /organizations/:id
 * 特定の組織を取得
 */
organizationsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const orgResult = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1)

    if (orgResult.length === 0) {
      return c.json({ success: false, error: '組織が見つかりません' }, 404)
    }

    // メンバー一覧も取得
    const members = await db
      .select({
        profileId: organizationMembers.profileId,
        roleId: organizationMembers.roleId,
        joinedAt: organizationMembers.joinedAt,
        profileName: profiles.name,
      })
      .from(organizationMembers)
      .leftJoin(profiles, eq(organizationMembers.profileId, profiles.id))
      .where(eq(organizationMembers.organizationId, id))

    return c.json({
      success: true,
      data: {
        ...orgResult[0],
        members,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /organizations/:id/members
 * 組織のメンバー一覧を取得
 */
organizationsRouter.get('/:id/members', async (c) => {
  try {
    const id = c.req.param('id')

    const members = await db
      .select({
        profileId: organizationMembers.profileId,
        roleId: organizationMembers.roleId,
        joinedAt: organizationMembers.joinedAt,
        profileName: profiles.name,
        profileBio: profiles.bio,
      })
      .from(organizationMembers)
      .leftJoin(profiles, eq(organizationMembers.profileId, profiles.id))
      .where(eq(organizationMembers.organizationId, id))

    return c.json({ success: true, data: members })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /organizations
 * 新しい組織を作成
 */
organizationsRouter.post(
  '/',
  requireAuth,
  requireProfile,
  zValidator('json', createOrganizationSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')
      const profileId = c.get('profileId')

      const result = await createOrganization({
        name: body.name,
        description: body.description,
      })

      if (!result.success) {
        return c.json({ success: false, error: result.error }, 500)
      }

      // 作成者をリーダーとして追加
      if (profileId && result.data) {
        await db.insert(organizationMembers).values({
          organizationId: result.data.id,
          profileId: profileId,
          roleId: 'org_leader',
        })

        // リーダープロフィールを設定
        await db
          .update(organizations)
          .set({ leaderProfileId: profileId })
          .where(eq(organizations.id, result.data.id))
      }

      return c.json({ success: true, data: result.data }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * PATCH /organizations/:id
 * 組織を更新
 */
organizationsRouter.patch(
  '/:id',
  requireAuth,
  requireProfile,
  zValidator('json', updateOrganizationSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      // リーダーか確認
      const orgResult = await db
        .select({ leaderProfileId: organizations.leaderProfileId })
        .from(organizations)
        .where(eq(organizations.id, id))
        .limit(1)

      if (orgResult.length === 0) {
        return c.json({ success: false, error: '組織が見つかりません' }, 404)
      }

      if (orgResult[0].leaderProfileId !== profileId) {
        return c.json({ success: false, error: '権限がありません' }, 403)
      }

      // 更新
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }
      if (body.name) updateData.name = body.name
      if (body.description !== undefined) updateData.description = body.description

      await db.update(organizations).set(updateData).where(eq(organizations.id, id))

      // 更新後のデータを取得
      const updated = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, id))
        .limit(1)

      return c.json({ success: true, data: updated[0] })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * DELETE /organizations/:id
 * 組織を削除
 */
organizationsRouter.delete('/:id', requireAuth, requireProfile, async (c) => {
  try {
    const id = c.req.param('id')
    const profileId = c.get('profileId')

    // リーダーか確認
    const orgResult = await db
      .select({ leaderProfileId: organizations.leaderProfileId })
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1)

    if (orgResult.length === 0) {
      return c.json({ success: false, error: '組織が見つかりません' }, 404)
    }

    if (orgResult[0].leaderProfileId !== profileId) {
      return c.json({ success: false, error: '権限がありません' }, 403)
    }

    await db.delete(organizations).where(eq(organizations.id, id))

    return c.json({ success: true, data: { deleted: id } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /organizations/:id/members
 * メンバーを追加
 */
organizationsRouter.post(
  '/:id/members',
  requireAuth,
  requireProfile,
  zValidator('json', addMemberSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      const currentProfileId = c.get('profileId')
      const body = c.req.valid('json')

      // リーダーか確認
      const orgResult = await db
        .select({ leaderProfileId: organizations.leaderProfileId })
        .from(organizations)
        .where(eq(organizations.id, id))
        .limit(1)

      if (orgResult.length === 0) {
        return c.json({ success: false, error: '組織が見つかりません' }, 404)
      }

      if (orgResult[0].leaderProfileId !== currentProfileId) {
        return c.json({ success: false, error: '権限がありません' }, 403)
      }

      // 既存メンバーか確認
      const existing = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, id),
            eq(organizationMembers.profileId, body.profileId)
          )
        )
        .limit(1)

      if (existing.length > 0) {
        return c.json({ success: false, error: '既にメンバーです' }, 400)
      }

      await db.insert(organizationMembers).values({
        organizationId: id,
        profileId: body.profileId,
        roleId: body.roleId,
      })

      return c.json({ success: true, data: { added: body.profileId } }, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * DELETE /organizations/:id/members/:profileId
 * メンバーを削除
 */
organizationsRouter.delete(
  '/:id/members/:profileId',
  requireAuth,
  requireProfile,
  async (c) => {
    try {
      const id = c.req.param('id')
      const targetProfileId = c.req.param('profileId')
      const currentProfileId = c.get('profileId')

      // リーダーか、または自分自身か確認
      const orgResult = await db
        .select({ leaderProfileId: organizations.leaderProfileId })
        .from(organizations)
        .where(eq(organizations.id, id))
        .limit(1)

      if (orgResult.length === 0) {
        return c.json({ success: false, error: '組織が見つかりません' }, 404)
      }

      const isLeader = orgResult[0].leaderProfileId === currentProfileId
      const isSelf = targetProfileId === currentProfileId

      if (!isLeader && !isSelf) {
        return c.json({ success: false, error: '権限がありません' }, 403)
      }

      // リーダーは自分を削除できない
      if (isLeader && isSelf) {
        return c.json({ success: false, error: 'リーダーは脱退できません。先にリーダーを変更してください。' }, 400)
      }

      await db
        .delete(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, id),
            eq(organizationMembers.profileId, targetProfileId)
          )
        )

      return c.json({ success: true, data: { removed: targetProfileId } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * POST /organizations/:id/join
 * 組織に参加（自分自身を追加）
 */
organizationsRouter.post('/:id/join', requireAuth, requireProfile, async (c) => {
  try {
    const id = c.req.param('id')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    // 組織が存在するか確認
    const orgResult = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1)

    if (orgResult.length === 0) {
      return c.json({ success: false, error: '組織が見つかりません' }, 404)
    }

    // 既存メンバーか確認
    const existing = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, id),
          eq(organizationMembers.profileId, profileId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return c.json({ success: false, error: '既にメンバーです' }, 400)
    }

    await db.insert(organizationMembers).values({
      organizationId: id,
      profileId: profileId,
      roleId: 'member',
    })

    return c.json({ success: true, data: { joined: id } }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /organizations/:id/leave
 * 組織から脱退
 */
organizationsRouter.post('/:id/leave', requireAuth, requireProfile, async (c) => {
  try {
    const id = c.req.param('id')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    // リーダーは脱退できない
    const orgResult = await db
      .select({ leaderProfileId: organizations.leaderProfileId })
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1)

    if (orgResult.length === 0) {
      return c.json({ success: false, error: '組織が見つかりません' }, 404)
    }

    if (orgResult[0].leaderProfileId === profileId) {
      return c.json({ success: false, error: 'リーダーは脱退できません。先にリーダーを変更してください。' }, 400)
    }

    await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, id),
          eq(organizationMembers.profileId, profileId)
        )
      )

    return c.json({ success: true, data: { left: id } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { organizationsRouter }
