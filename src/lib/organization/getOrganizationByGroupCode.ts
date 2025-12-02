import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { organizations } from '@/db/schema'

/**
 * グループコードから組織を取得する
 * 現在は organizationId を groupCode として扱う（将来的には短いコードを追加予定）
 * @param groupCode 組織のグループコード（現在は組織ID）
 * @returns 組織情報、見つからない場合は null
 */
export async function getOrganizationByGroupCode(groupCode: string) {
  if (!groupCode) {
    return null
  }

  const result = await db.query.organizations.findFirst({
    where: eq(organizations.id, groupCode),
  })

  return result ?? null
}
