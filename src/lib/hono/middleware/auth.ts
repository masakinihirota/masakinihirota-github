/**
 * 認証ミドルウェア
 * @description Supabase認証を利用してユーザー情報をコンテキストに設定
 */

import type { MiddlewareHandler } from 'hono'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { rootAccounts, profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { AppEnv } from '../types'

/**
 * 認証ミドルウェア（オプショナル）
 * ユーザー情報があれば設定、なくても処理を続行
 */
export const authMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      c.set('user', null)
      c.set('rootAccountId', null)
      c.set('profileId', null)
      return next()
    }

    c.set('user', { id: user.id, email: user.email })

    // RootAccountを取得
    const rootAccountResult = await db
      .select({ id: rootAccounts.id })
      .from(rootAccounts)
      .where(eq(rootAccounts.userId, user.id))
      .limit(1)

    if (rootAccountResult.length > 0) {
      c.set('rootAccountId', rootAccountResult[0].id)

      // デフォルトプロフィールを取得
      const profileResult = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.rootAccountId, rootAccountResult[0].id))
        .limit(1)

      c.set('profileId', profileResult.length > 0 ? profileResult[0].id : null)
    } else {
      c.set('rootAccountId', null)
      c.set('profileId', null)
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    c.set('user', null)
    c.set('rootAccountId', null)
    c.set('profileId', null)
  }

  return next()
}

/**
 * 認証必須ミドルウェア
 * 認証されていない場合は401を返す
 */
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const user = c.get('user')

  if (!user) {
    return c.json(
      { success: false, error: '認証が必要です', code: 'UNAUTHORIZED' },
      401
    )
  }

  return next()
}

/**
 * プロフィール必須ミドルウェア
 * プロフィールが存在しない場合は403を返す
 */
export const requireProfile: MiddlewareHandler<AppEnv> = async (c, next) => {
  const profileId = c.get('profileId')

  if (!profileId) {
    return c.json(
      { success: false, error: 'プロフィールが必要です', code: 'FORBIDDEN' },
      403
    )
  }

  return next()
}
