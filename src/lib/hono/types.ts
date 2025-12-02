/**
 * HONO API 共通型定義
 * @description 全APIルートで使用する共通型
 */

import type { Context } from 'hono'

/**
 * 認証済みユーザーコンテキスト用の環境変数型
 */
export type AppEnv = {
  Variables: {
    user: {
      id: string
      email?: string
    } | null
    rootAccountId: string | null
    profileId: string | null
  }
}

/**
 * APIレスポンスの共通型
 */
export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
  code?: string
}

/**
 * ページネーション付きレスポンス
 */
export type PaginatedResponse<T> = {
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

/**
 * HONOコンテキストの拡張型
 */
export type AppContext = Context<AppEnv>

/**
 * 共通エラーコード
 */
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]
