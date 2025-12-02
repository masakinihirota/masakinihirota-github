/**
 * updateWorkReaction Server Action テスト
 *
 * TDD GREEN フェーズ: Task 7.3 - スキ/拍手（ポイント消費）と履歴記録
 *
 * テスト対象:
 * - スキの更新
 * - 拍手の追加とポイント消費
 * - 履歴記録（point_transactions）
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// DBモック
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
    insert: vi.fn(),
    values: vi.fn(),
    returning: vi.fn(),
    execute: vi.fn(),
    onConflictDoUpdate: vi.fn(),
  },
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// テスト対象のインポートは vi.mock の後で行う
import { updateWorkReaction, UpdateWorkReactionInput } from './updateWorkReaction'
import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

describe('updateWorkReaction (Server Action)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('認証', () => {
    it('throws UnauthorizedError when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

      const input: UpdateWorkReactionInput = {
        profileId: 'profile-123',
        workId: 'work-456',
        action: 'like',
      }

      await expect(updateWorkReaction(input)).rejects.toThrow('Unauthorized')
    })
  })

  describe('スキ操作', () => {
    it('updates liked status in profile_works table', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

      // selectのモック設定
      let selectCallCount = 0
      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockImplementation(() => {
            selectCallCount++
            if (selectCallCount === 1) {
              // profiles テーブルからの取得
              return Promise.resolve([{ id: 'profile-123', rootAccountId: 'root-account-123' }])
            }
            if (selectCallCount === 2) {
              // profile_works テーブルからの取得（既存レコードなし）
              return Promise.resolve([])
            }
            return Promise.resolve([])
          }),
        })),
      }) as unknown as ReturnType<typeof db.select>)

      // insertのモック設定
      vi.mocked(db.insert).mockImplementation(() => ({
        values: vi.fn().mockReturnValue(Promise.resolve()),
      }) as unknown as ReturnType<typeof db.insert>)

      const input: UpdateWorkReactionInput = {
        profileId: 'profile-123',
        workId: 'work-456',
        action: 'like',
      }

      const result = await updateWorkReaction(input)

      expect(result.success).toBe(true)
      expect(result.liked).toBe(true)
    })
  })

  describe('拍手操作', () => {
    it('increments claps and consumes points', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

      let selectCallCount = 0
      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockImplementation(() => {
            selectCallCount++
            if (selectCallCount === 1) {
              // profiles テーブルからの取得
              return Promise.resolve([{ id: 'profile-123', rootAccountId: 'root-account-123' }])
            }
            if (selectCallCount === 2) {
              // profile_works テーブルからの取得
              return Promise.resolve([{ profileId: 'profile-123', workId: 'work-456', liked: false, claps: 0 }])
            }
            if (selectCallCount === 3) {
              // root_account_points テーブルからの取得
              return Promise.resolve([{ rootAccountId: 'root-account-123', balance: 100 }])
            }
            return Promise.resolve([])
          }),
        })),
      }) as unknown as ReturnType<typeof db.select>)

      // update と insert のモック
      vi.mocked(db.update).mockImplementation(() => ({
        set: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockReturnValue(Promise.resolve()),
        })),
      }) as unknown as ReturnType<typeof db.update>)

      vi.mocked(db.insert).mockImplementation(() => ({
        values: vi.fn().mockReturnValue(Promise.resolve()),
      }) as unknown as ReturnType<typeof db.insert>)

      // execute のモック (BEGIN/COMMIT)
      vi.mocked(db.execute).mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof db.execute>>)

      const input: UpdateWorkReactionInput = {
        profileId: 'profile-123',
        workId: 'work-456',
        action: 'clap',
        clapPointCost: 1,
      }

      const result = await updateWorkReaction(input)

      expect(result.success).toBe(true)
      expect(result.claps).toBe(1)
      expect(result.pointsRemaining).toBe(99)
    })

    it('rejects when insufficient points', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

      let selectCallCount = 0
      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockImplementation(() => {
            selectCallCount++
            if (selectCallCount === 1) {
              // profiles テーブルからの取得
              return Promise.resolve([{ id: 'profile-123', rootAccountId: 'root-account-123' }])
            }
            if (selectCallCount === 2) {
              // profile_works テーブルからの取得
              return Promise.resolve([])
            }
            if (selectCallCount === 3) {
              // root_account_points テーブルからの取得（ポイント不足）
              return Promise.resolve([{ rootAccountId: 'root-account-123', balance: 0 }])
            }
            return Promise.resolve([])
          }),
        })),
      }) as unknown as ReturnType<typeof db.select>)

      // execute のモック (BEGIN/ROLLBACK)
      vi.mocked(db.execute).mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof db.execute>>)

      const input: UpdateWorkReactionInput = {
        profileId: 'profile-123',
        workId: 'work-456',
        action: 'clap',
        clapPointCost: 1,
      }

      await expect(updateWorkReaction(input)).rejects.toThrow('Insufficient points')
    })
  })

  describe('履歴記録', () => {
    it('creates point_transaction record when clapping', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

      let selectCallCount = 0
      vi.mocked(db.select).mockImplementation(() => ({
        from: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockImplementation(() => {
            selectCallCount++
            if (selectCallCount === 1) {
              return Promise.resolve([{ id: 'profile-123', rootAccountId: 'root-account-123' }])
            }
            if (selectCallCount === 2) {
              return Promise.resolve([{ profileId: 'profile-123', workId: 'work-456', liked: false, claps: 0 }])
            }
            if (selectCallCount === 3) {
              return Promise.resolve([{ rootAccountId: 'root-account-123', balance: 100 }])
            }
            return Promise.resolve([])
          }),
        })),
      }) as unknown as ReturnType<typeof db.select>)

      // update のモック
      vi.mocked(db.update).mockImplementation(() => ({
        set: vi.fn().mockImplementation(() => ({
          where: vi.fn().mockReturnValue(Promise.resolve()),
        })),
      }) as unknown as ReturnType<typeof db.update>)

      // insert のモック - point_transactions への挿入を検証
      let insertedTransactionData: unknown = null
      vi.mocked(db.insert).mockImplementation(() => ({
        values: vi.fn().mockImplementation((data) => {
          // point_transactions テーブルへの挿入をキャプチャ
          if (data && 'delta' in data) {
            insertedTransactionData = data
          }
          return Promise.resolve()
        }),
      }) as unknown as ReturnType<typeof db.insert>)

      // execute のモック
      vi.mocked(db.execute).mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof db.execute>>)

      const input: UpdateWorkReactionInput = {
        profileId: 'profile-123',
        workId: 'work-456',
        action: 'clap',
        clapPointCost: 1,
      }

      await updateWorkReaction(input)

      expect(insertedTransactionData).toMatchObject({
        rootAccountId: 'root-account-123',
        delta: -1,
        reason: 'CLAP',
      })
    })
  })
})
