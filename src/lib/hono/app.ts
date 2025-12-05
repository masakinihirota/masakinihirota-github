/**
 * HONO APIアプリケーション
 * @description 全APIルートを統合したHONOアプリケーション
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { AppEnv } from './types'
import { authMiddleware, errorHandler, notFoundHandler } from './middleware'
import {
  profilesRouter,
  worksRouter,
  organizationsRouter,
  nationsRouter,
  profileWorksRouter,
  searchRouter,
  authRouter,
  pointsRouter,
  matchingRouter,
} from './routes'

/**
 * HONO APIアプリケーションを作成
 */
export function createHonoApp() {
  const app = new Hono<AppEnv>().basePath('/api/v1')

  // グローバルミドルウェア
  app.use('*', logger())
  app.use('*', cors({
    origin: (origin) => {
      // 開発環境では全てのオリジンを許可
      if (process.env.NODE_ENV === 'development') {
        return origin || '*'
      }
      // 本番環境では特定のオリジンのみ許可
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL,
        'https://masakinihirota.vercel.app',
      ].filter(Boolean) as string[]

      if (origin && allowedOrigins.includes(origin)) {
        return origin
      }
      return allowedOrigins[0] || '*'
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400,
    credentials: true,
  }))

  // 認証ミドルウェア（全ルートで実行、ユーザー情報を設定）
  app.use('*', authMiddleware)

  // エラーハンドラー
  app.onError(errorHandler)
  app.notFound(notFoundHandler)

  // ヘルスチェック
  app.get('/health', (c) => {
    return c.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    })
  })

  // ルートをマウント
  app.route('/auth', authRouter)
  app.route('/profiles', profilesRouter)
  app.route('/works', worksRouter)
  app.route('/organizations', organizationsRouter)
  app.route('/nations', nationsRouter)
  app.route('/profile-works', profileWorksRouter)
  app.route('/search', searchRouter)
  app.route('/points', pointsRouter)
  app.route('/matching', matchingRouter)

  return app
}

// デフォルトのアプリインスタンス
export const honoApp = createHonoApp()

export type HonoApp = ReturnType<typeof createHonoApp>
