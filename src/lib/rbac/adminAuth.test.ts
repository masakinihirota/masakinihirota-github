/**
 * 管理者認証ユーティリティのテスト
 * @description TDD: Task 5.3.1 - 管理者ロールチェック
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isUserAdmin, getUserSystemRoles, ADMIN_ROLE_ID } from './adminAuth'

// DBモック
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
  },
}))

describe('adminAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isUserAdmin', () => {
    it('should return false when userId is empty', async () => {
      const result = await isUserAdmin('')
      expect(result).toBe(false)
    })

    it('should return false when user has no admin role', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as unknown as ReturnType<typeof db.select>)

      const result = await isUserAdmin('user-123')
      expect(result).toBe(false)
    })

    it('should return true when user has admin role', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'user-123', roleId: ADMIN_ROLE_ID }]),
          }),
        }),
      } as unknown as ReturnType<typeof db.select>)

      const result = await isUserAdmin('user-123')
      expect(result).toBe(true)
    })

    it('should return false when database error occurs', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error('DB error')),
          }),
        }),
      } as unknown as ReturnType<typeof db.select>)

      const result = await isUserAdmin('user-123')
      expect(result).toBe(false)
    })
  })

  describe('getUserSystemRoles', () => {
    it('should return empty array when userId is empty', async () => {
      const result = await getUserSystemRoles('')
      expect(result).toEqual([])
    })

    it('should return role IDs for user', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { roleId: 'sys_admin' },
            { roleId: 'sys_moderator' },
          ]),
        }),
      } as unknown as ReturnType<typeof db.select>)

      const result = await getUserSystemRoles('user-123')
      expect(result).toEqual(['sys_admin', 'sys_moderator'])
    })
  })

  describe('ADMIN_ROLE_ID', () => {
    it('should be sys_admin', () => {
      expect(ADMIN_ROLE_ID).toBe('sys_admin')
    })
  })
})
