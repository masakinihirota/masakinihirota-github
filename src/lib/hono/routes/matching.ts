/**
 * Matching API ルート
 * @description マッチング関連のAPI
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { matchHistory, profiles, profileWorks, profileValues } from '@/db/schema'
import { eq, desc, and, ne } from 'drizzle-orm'
import { computeMatches } from '@/actions/computeMatches.fetch'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth, requireProfile } from '@/lib/hono/middleware'

const matchingRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const computeMatchesSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
})

/**
 * GET /matching
 * マッチング履歴を取得
 */
matchingRouter.get('/', requireAuth, requireProfile, async (c) => {
  try {
    const profileId = c.get('profileId')
    const limit = Number(c.req.query('limit') || '50')
    const offset = Number(c.req.query('offset') || '0')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    const matches = await db
      .select({
        id: matchHistory.id,
        matchedProfileId: matchHistory.matchedProfileId,
        score: matchHistory.score,
        matchedAt: matchHistory.matchedAt,
        matchedProfileName: profiles.name,
        matchedProfileBio: profiles.bio,
      })
      .from(matchHistory)
      .leftJoin(profiles, eq(matchHistory.matchedProfileId, profiles.id))
      .where(eq(matchHistory.profileId, profileId))
      .orderBy(desc(matchHistory.matchedAt))
      .limit(limit)
      .offset(offset)

    return c.json({
      success: true,
      data: matches,
      pagination: {
        limit,
        offset,
        hasMore: matches.length === limit,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /matching/compute
 * マッチングを計算
 */
matchingRouter.post(
  '/compute',
  requireAuth,
  requireProfile,
  zValidator('json', computeMatchesSchema),
  async (c) => {
    try {
      const profileId = c.get('profileId')
      const body = c.req.valid('json')

      if (!profileId) {
        return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
      }

      // computeMatches expects profileId as string and limit as number
      const result = await computeMatches(profileId, body.limit)

      return c.json({ success: true, data: result })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

/**
 * GET /matching/suggestions
 * マッチング提案を取得（簡易版）
 */
matchingRouter.get('/suggestions', requireAuth, requireProfile, async (c) => {
  try {
    const profileId = c.get('profileId')
    const limit = Number(c.req.query('limit') || '10')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    // 現在のプロフィールの作品を取得
    const myWorks = await db
      .select({ workId: profileWorks.workId })
      .from(profileWorks)
      .where(eq(profileWorks.profileId, profileId))

    const myWorkIds = myWorks.map(w => w.workId)

    if (myWorkIds.length === 0) {
      return c.json({ success: true, data: [], message: '作品を追加してマッチングを開始してください' })
    }

    // 同じ作品を持つプロフィールを検索
    const suggestions = await db
      .selectDistinct({
        profileId: profileWorks.profileId,
        profileName: profiles.name,
        profileBio: profiles.bio,
      })
      .from(profileWorks)
      .leftJoin(profiles, eq(profileWorks.profileId, profiles.id))
      .where(and(
        ne(profileWorks.profileId, profileId),
        // 共通の作品を持つプロフィール
      ))
      .limit(limit)

    return c.json({ success: true, data: suggestions })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * DELETE /matching/:matchId
 * マッチング履歴を削除
 */
matchingRouter.delete('/:matchId', requireAuth, requireProfile, async (c) => {
  try {
    const matchId = c.req.param('matchId')
    const profileId = c.get('profileId')

    if (!profileId) {
      return c.json({ success: false, error: 'プロフィールが必要です' }, 403)
    }

    // 自分のマッチング履歴か確認
    const matchResult = await db
      .select({ profileId: matchHistory.profileId })
      .from(matchHistory)
      .where(eq(matchHistory.id, matchId))
      .limit(1)

    if (matchResult.length === 0) {
      return c.json({ success: false, error: 'マッチング履歴が見つかりません' }, 404)
    }

    if (matchResult[0].profileId !== profileId) {
      return c.json({ success: false, error: '権限がありません' }, 403)
    }

    await db.delete(matchHistory).where(eq(matchHistory.id, matchId))

    return c.json({ success: true, data: { deleted: matchId } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { matchingRouter }
