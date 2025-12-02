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

  return result ?? null
}

/**
 * オーナーIDでリスト一覧を取得します
 */
export async function getListsByOwnerId(ownerId: string): Promise<List[]> {
  const results = await db.query.lists.findMany({
    where: eq(lists.ownerId, ownerId),
    orderBy: [desc(lists.updatedAt)],
  })

  return results
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

  return result
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

  // rowCountがある場合、削除が成功したかどうかを返す
  return (result?.rowCount ?? 0) > 0
}
