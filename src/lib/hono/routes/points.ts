/**
 * Points API ルート
 * @description ポイント関連のAPI
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '@/lib/db'
import { rootAccountPoints, pointTransactions, ledgerEntries } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth } from '@/lib/hono/middleware'

const pointsRouter = new Hono<AppEnv>()

// バリデーションスキーマ
const transferPointsSchema = z.object({
  toRootAccountId: z.string().uuid('有効なアカウントIDを入力してください'),
  amount: z.number().int().min(1, '1以上の数値を入力してください'),
  reason: z.string().max(200).optional(),
})

/**
 * GET /points
 * 現在のポイント残高を取得
 */
pointsRouter.get('/', requireAuth, async (c) => {
  try {
    const rootAccountId = c.get('rootAccountId')

    if (!rootAccountId) {
      return c.json({ success: false, error: 'ルートアカウントが見つかりません' }, 404)
    }

    const pointsResult = await db
      .select()
      .from(rootAccountPoints)
      .where(eq(rootAccountPoints.rootAccountId, rootAccountId))
      .limit(1)

    return c.json({
      success: true,
      data: {
        balance: pointsResult[0]?.balance ?? 0,
        lastUpdated: pointsResult[0]?.lastUpdated ?? null,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /points/transactions
 * ポイント取引履歴を取得
 */
pointsRouter.get('/transactions', requireAuth, async (c) => {
  try {
    const rootAccountId = c.get('rootAccountId')
    const limit = Number(c.req.query('limit') || '50')
    const offset = Number(c.req.query('offset') || '0')

    if (!rootAccountId) {
      return c.json({ success: false, error: 'ルートアカウントが見つかりません' }, 404)
    }

    const transactions = await db
      .select()
      .from(pointTransactions)
      .where(eq(pointTransactions.rootAccountId, rootAccountId))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    return c.json({
      success: true,
      data: transactions,
      pagination: {
        limit,
        offset,
        hasMore: transactions.length === limit,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /points/ledger
 * 台帳エントリを取得
 */
pointsRouter.get('/ledger', requireAuth, async (c) => {
  try {
    const rootAccountId = c.get('rootAccountId')
    const limit = Number(c.req.query('limit') || '50')
    const offset = Number(c.req.query('offset') || '0')

    if (!rootAccountId) {
      return c.json({ success: false, error: 'ルートアカウントが見つかりません' }, 404)
    }

    // rootAccountIdをledgerIdとして検索
    const entries = await db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.ledgerId, rootAccountId))
      .orderBy(desc(ledgerEntries.createdAt))
      .limit(limit)
      .offset(offset)

    return c.json({
      success: true,
      data: entries,
      pagination: {
        limit,
        offset,
        hasMore: entries.length === limit,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /points/transfer
 * ポイントを送金（将来的な機能）
 * 注意: 現在は基本的なバリデーションのみで、実際のポイント送金ロジックは
 * ポイント経済設計に基づいて実装する必要があります
 */
pointsRouter.post(
  '/transfer',
  requireAuth,
  zValidator('json', transferPointsSchema),
  async (c) => {
    try {
      const rootAccountId = c.get('rootAccountId')
      const body = c.req.valid('json')

      if (!rootAccountId) {
        return c.json({ success: false, error: 'ルートアカウントが見つかりません' }, 404)
      }

      // 残高確認
      const currentBalance = await db
        .select({ balance: rootAccountPoints.balance })
        .from(rootAccountPoints)
        .where(eq(rootAccountPoints.rootAccountId, rootAccountId))
        .limit(1)

      const balance = currentBalance[0]?.balance ?? 0

      if (balance < body.amount) {
        return c.json({ success: false, error: 'ポイントが不足しています' }, 400)
      }

      // 送金先の確認
      const targetAccount = await db
        .select({ rootAccountId: rootAccountPoints.rootAccountId })
        .from(rootAccountPoints)
        .where(eq(rootAccountPoints.rootAccountId, body.toRootAccountId))
        .limit(1)

      if (targetAccount.length === 0) {
        // 送金先にポイントレコードがなければ作成
        await db.insert(rootAccountPoints).values({
          rootAccountId: body.toRootAccountId,
          balance: 0,
        })
      }

      // トランザクション処理
      // 送金元の残高を減らす
      await db
        .update(rootAccountPoints)
        .set({
          balance: balance - body.amount,
          lastUpdated: new Date(),
        })
        .where(eq(rootAccountPoints.rootAccountId, rootAccountId))

      // 送金先の残高を増やす
      const targetBalance = await db
        .select({ balance: rootAccountPoints.balance })
        .from(rootAccountPoints)
        .where(eq(rootAccountPoints.rootAccountId, body.toRootAccountId))
        .limit(1)

      await db
        .update(rootAccountPoints)
        .set({
          balance: (targetBalance[0]?.balance ?? 0) + body.amount,
          lastUpdated: new Date(),
        })
        .where(eq(rootAccountPoints.rootAccountId, body.toRootAccountId))

      // 取引履歴を記録（送金元）
      await db.insert(pointTransactions).values({
        rootAccountId: rootAccountId,
        delta: -body.amount,
        reason: body.reason ?? 'ポイント送金',
        relatedEntity: 'transfer',
        relatedId: body.toRootAccountId,
      })

      // 取引履歴を記録（送金先）
      await db.insert(pointTransactions).values({
        rootAccountId: body.toRootAccountId,
        delta: body.amount,
        reason: body.reason ?? 'ポイント受取',
        relatedEntity: 'transfer',
        relatedId: rootAccountId,
      })

      return c.json({
        success: true,
        data: {
          transferred: body.amount,
          newBalance: balance - body.amount,
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return c.json({ success: false, error: message }, 500)
    }
  }
)

export { pointsRouter }
