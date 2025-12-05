/**
 * リストサービス
 * リスト機能のCRUD操作を提供します
 */

import { db } from '@/lib/db'
import { lists } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

// 可視性の定義
export const ListVisibility = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  RESTRICTED: 'restricted',
} as const

export type ListVisibilityType = typeof ListVisibility[keyof typeof ListVisibility]

// リスト作成用の入力型
export interface CreateListInput {
  title: string
  description?: string
  ownerId: string
  visibility?: ListVisibilityType
  listType?: string
}

// リスト更新用の入力型
export interface UpdateListInput {
  id: string
  title?: string
  description?: string
  visibility?: ListVisibilityType
  listType?: string
}

// リスト型
export interface List {
  id: string
  title: string
  description: string | null
  ownerId: string
  visibility: ListVisibilityType
  listType: string
  createdAt: Date
  updatedAt: Date
}

/**
 * 新しいリストを作成します
 */
export async function createList(input: CreateListInput): Promise<{ id: string }> {
  // バリデーション
  if (!input.title || input.title.trim() === '') {
    throw new Error('タイトルは必須です')
  }
  if (!input.ownerId || input.ownerId.trim() === '') {
    throw new Error('オーナーIDは必須です')
  }

  const [result] = await db.insert(lists).values({
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    ownerId: input.ownerId,
    visibility: input.visibility ?? ListVisibility.PRIVATE,
    listType: input.listType ?? 'custom',
  }).returning({ id: lists.id })

  return result
}

/**
 * IDでリストを取得します
 */
export async function getListById(id: string): Promise<List | null> {
  const result = await db.query.lists.findFirst({
    where: eq(lists.id, id),
  })

  if (!result) return null

  // DB の戻り値は string 型などの可能性があるため、安全に List 型へマッピングする
  const visibility = (result.visibility as ListVisibilityType) ?? ListVisibility.PRIVATE

  const list: List = {
    id: result.id,
    title: result.title ?? '',
    description: result.description ?? null,
    ownerId: result.ownerId,
    visibility,
    listType: result.listType ?? 'custom',
    createdAt: result.createdAt ?? new Date(),
    updatedAt: result.updatedAt ?? new Date(),
  }

  return list
}

/**
 * オーナーIDでリスト一覧を取得します
 */
export async function getListsByOwnerId(ownerId: string): Promise<List[]> {
  const results = await db.query.lists.findMany({
    where: eq(lists.ownerId, ownerId),
    orderBy: [desc(lists.updatedAt)],
  })

  // マッピングして型の不整合を解消
  return results.map((r) => ({
    id: r.id,
    title: r.title ?? '',
    description: r.description ?? null,
    ownerId: r.ownerId,
    visibility: (r.visibility as ListVisibilityType) ?? ListVisibility.PRIVATE,
    listType: r.listType ?? 'custom',
    createdAt: r.createdAt ?? new Date(),
    updatedAt: r.updatedAt ?? new Date(),
  }))
}

/**
 * リストを更新します
 */
export async function updateList(input: UpdateListInput): Promise<List> {
  // バリデーション
  if (!input.id || input.id.trim() === '') {
    throw new Error('リストIDは必須です')
  }

  const updateData: Partial<{
    title: string
    description: string
    visibility: ListVisibilityType
    listType: string
    updatedAt: Date
  }> = {
    updatedAt: new Date(),
  }

  if (input.title !== undefined) {
    updateData.title = input.title.trim()
  }
  if (input.description !== undefined) {
    updateData.description = input.description.trim()
  }
  if (input.visibility !== undefined) {
    updateData.visibility = input.visibility
  }
  if (input.listType !== undefined) {
    updateData.listType = input.listType
  }

  const [result] = await db.update(lists)
    .set(updateData)
    .where(eq(lists.id, input.id))
    .returning()

  if (!result) throw new Error('更新に失敗しました')

  return {
    id: result.id,
    title: result.title ?? '',
    description: result.description ?? null,
    ownerId: result.ownerId,
    visibility: (result.visibility as ListVisibilityType) ?? ListVisibility.PRIVATE,
    listType: result.listType ?? 'custom',
    createdAt: result.createdAt ?? new Date(),
    updatedAt: result.updatedAt ?? new Date(),
  }
}

/**
 * リストを削除します
 */
export async function deleteList(id: string): Promise<boolean> {
  // バリデーション
  if (!id || id.trim() === '') {
    throw new Error('リストIDは必須です')
  }

  const result = await db.delete(lists).where(eq(lists.id, id))

  // Drizzle/DBクライアントによって戻り値の形が変わるため安全に deleted count を抽出
  const deletedCount =
    typeof (result as any)?.rowCount === 'number'
      ? (result as any).rowCount
      : Array.isArray(result)
      ? result.length
      : typeof (result as any)?.count === 'number'
      ? (result as any).count
      : 0

  return deletedCount > 0
}
