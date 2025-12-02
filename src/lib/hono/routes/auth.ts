/**
 * Auth API ルート
 * @description 認証関連のAPI
 */

import { Hono } from 'hono'
import { db } from '@/lib/db'
import { users, rootAccounts, profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import type { AppEnv } from '@/lib/hono/types'
import { requireAuth } from '@/lib/hono/middleware'

const authRouter = new Hono<AppEnv>()

/**
 * GET /auth/me
 * 現在のユーザー情報を取得
 */
authRouter.get('/me', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const rootAccountId = c.get('rootAccountId')
    const profileId = c.get('profileId')

    if (!user) {
      return c.json({ success: false, error: '認証が必要です' }, 401)
    }

    // ユーザー詳細情報を取得
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    let rootAccount = null
    let profile = null

    if (rootAccountId) {
      const rootAccountResult = await db
        .select()
        .from(rootAccounts)
        .where(eq(rootAccounts.id, rootAccountId))
        .limit(1)
      rootAccount = rootAccountResult[0] ?? null
    }

    if (profileId) {
      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1)
      profile = profileResult[0] ?? null
    }

    return c.json({
      success: true,
      data: {
        user: userResult[0] ?? null,
        rootAccount,
        profile,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /auth/session
 * セッション情報を取得
 */
authRouter.get('/session', async (c) => {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return c.json({ success: false, error: error.message }, 500)
    }

    return c.json({
      success: true,
      data: {
        isAuthenticated: !!session,
        expiresAt: session?.expires_at,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * POST /auth/signout
 * サインアウト
 */
authRouter.post('/signout', async (c) => {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return c.json({ success: false, error: error.message }, 500)
    }

    return c.json({ success: true, data: { signedOut: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

/**
 * GET /auth/profiles
 * 現在のユーザーの全プロフィール一覧を取得
 */
authRouter.get('/profiles', requireAuth, async (c) => {
  try {
    const rootAccountId = c.get('rootAccountId')

    if (!rootAccountId) {
      return c.json({ success: false, error: 'ルートアカウントが見つかりません' }, 404)
    }

    const profileList = await db
      .select()
      .from(profiles)
      .where(eq(profiles.rootAccountId, rootAccountId))

    return c.json({ success: true, data: profileList })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})

export { authRouter }
