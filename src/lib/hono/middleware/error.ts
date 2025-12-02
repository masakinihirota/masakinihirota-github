/**
 * エラーハンドリングミドルウェア
 * @description 全APIで共通のエラーハンドリング
 */

import type { ErrorHandler } from 'hono'
import type { AppEnv } from '../types'
import { ErrorCodes } from '../types'

/**
 * グローバルエラーハンドラー
 */
export const errorHandler: ErrorHandler<AppEnv> = (err, c) => {
  console.error('API Error:', err)

  // Zodバリデーションエラー
  if (err.name === 'ZodError') {
    return c.json(
      {
        success: false,
        error: 'バリデーションエラー',
        code: ErrorCodes.VALIDATION_ERROR,
        details: err,
      },
      400
    )
  }

  // 一般的なエラー
  const message = err instanceof Error ? err.message : '内部エラーが発生しました'

  return c.json(
    {
      success: false,
      error: message,
      code: ErrorCodes.INTERNAL_ERROR,
    },
    500
  )
}

/**
 * NotFoundハンドラー
 */
export const notFoundHandler = (c: import('hono').Context) => {
  return c.json(
    {
      success: false,
      error: 'APIエンドポイントが見つかりません',
      code: ErrorCodes.NOT_FOUND,
    },
    404
  )
}
