/**
 * 管理者認証ユーティリティ
 * @description 管理者ロールチェックのためのユーティリティ関数
 */

import { db } from '@/lib/db'
import { userSystemRoles, aclRoles } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

/** システム管理者ロールID */
export const ADMIN_ROLE_ID = 'sys_admin'

/**
 * ユーザーが管理者権限を持っているかチェック
 * @param userId - チェック対象のユーザーID
 * @returns 管理者権限があればtrue
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false

  try {
    const result = await db
      .select()
      .from(userSystemRoles)
      .where(
        and(
          eq(userSystemRoles.userId, userId),
          eq(userSystemRoles.roleId, ADMIN_ROLE_ID)
        )
      )
      .limit(1)

    return result.length > 0
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * ユーザーのシステムロール一覧を取得
 * @param userId - 対象のユーザーID
 * @returns ロールID配列
 */
export async function getUserSystemRoles(userId: string): Promise<string[]> {
  if (!userId) return []

  try {
    const result = await db
      .select({ roleId: userSystemRoles.roleId })
      .from(userSystemRoles)
      .where(eq(userSystemRoles.userId, userId))

    return result.map(r => r.roleId)
  } catch (error) {
    console.error('Error fetching user system roles:', error)
    return []
  }
}
