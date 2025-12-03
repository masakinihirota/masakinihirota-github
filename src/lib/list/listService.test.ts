/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// スキーマがまだないのでモック
vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 'mock-list-id' }]),
    query: {
      lists: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  },
}))

import {
  createList,
  getListById,
  getListsByOwnerId,
  updateList,
  deleteList,
  type CreateListInput,
  type UpdateListInput,
  ListVisibility,
} from './listService'

describe('listService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createList', () => {
    it('必須フィールドでリストを作成できる', async () => {
      const input: CreateListInput = {
        title: 'テストリスト',
        ownerId: 'test-owner-id',
      }

      const result = await createList(input)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
    })

    it('オプショナルフィールドを含めてリストを作成できる', async () => {
      const input: CreateListInput = {
        title: 'テストリスト',
        description: 'テスト説明文',
        ownerId: 'test-owner-id',
        visibility: ListVisibility.PUBLIC,
        listType: 'favorites',
      }

      const result = await createList(input)

      expect(result).toBeDefined()
    })

    it('タイトルが空の場合エラーをスローする', async () => {
      const input: CreateListInput = {
        title: '',
        ownerId: 'test-owner-id',
      }

      await expect(createList(input)).rejects.toThrow('タイトルは必須です')
    })

    it('オーナーIDが空の場合エラーをスローする', async () => {
      const input: CreateListInput = {
        title: 'テストリスト',
        ownerId: '',
      }

      await expect(createList(input)).rejects.toThrow('オーナーIDは必須です')
    })
  })

  describe('getListById', () => {
    it('IDでリストを取得できる', async () => {
      const now = new Date()
      const mockList = {
        id: 'list-1',
        title: 'テストリスト',
        description: null,
        ownerId: 'owner-1',
        visibility: ListVisibility.PRIVATE,
        listType: 'custom',
        createdAt: now,
        updatedAt: now,
      }

      const { db } = await import('@/lib/db')
      vi.mocked(db.query.lists.findFirst).mockResolvedValue(mockList)

      const result = await getListById('list-1')

      expect(result).toEqual(mockList)
    })

    it('存在しないIDの場合nullを返す', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.query.lists.findFirst).mockResolvedValue(undefined)

      const result = await getListById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getListsByOwnerId', () => {
    it('オーナーIDでリスト一覧を取得できる', async () => {
      const mockLists = [
        { id: 'list-1', title: 'リスト1', ownerId: 'owner-1' },
        { id: 'list-2', title: 'リスト2', ownerId: 'owner-1' },
      ]

      const { db } = await import('@/lib/db')
      vi.mocked(db.query.lists.findMany).mockResolvedValue(mockLists)

      const result = await getListsByOwnerId('owner-1')

      expect(result).toHaveLength(2)
    })

    it('リストが存在しない場合空配列を返す', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.query.lists.findMany).mockResolvedValue([])

      const result = await getListsByOwnerId('no-lists-owner')

      expect(result).toEqual([])
    })
  })

  describe('updateList', () => {
    it('リストを更新できる', async () => {
      const now = new Date()
      const mockUpdated = {
        id: 'list-1',
        title: '更新後タイトル',
        description: null,
        ownerId: 'owner-1',
        visibility: ListVisibility.PRIVATE,
        listType: 'custom',
        createdAt: now,
        updatedAt: now,
      }

      const { db } = await import('@/lib/db')
      vi.mocked(db.update).mockReturnThis()
      vi.mocked(db.update({} as never).set).mockReturnThis()
      vi.mocked(db.update({} as never).set({} as never).where).mockReturnThis()
      vi.mocked(db.update({} as never).set({} as never).where({} as never).returning).mockResolvedValue([mockUpdated])

      const input: UpdateListInput = {
        id: 'list-1',
        title: '更新後タイトル',
      }

      const result = await updateList(input)

      expect(result).toEqual(mockUpdated)
    })

    it('IDが空の場合エラーをスローする', async () => {
      const input: UpdateListInput = {
        id: '',
        title: '更新後タイトル',
      }

      await expect(updateList(input)).rejects.toThrow('リストIDは必須です')
    })
  })

  describe('deleteList', () => {
    it('リストを削除できる', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.delete).mockReturnThis()
      vi.mocked(db.delete({} as never).where).mockResolvedValue({ rowCount: 1 } as never)

      const result = await deleteList('list-1')

      expect(result).toBe(true)
    })

    it('存在しないリストの削除はfalseを返す', async () => {
      const { db } = await import('@/lib/db')
      vi.mocked(db.delete).mockReturnThis()
      vi.mocked(db.delete({} as never).where).mockResolvedValue({ rowCount: 0 } as never)

      const result = await deleteList('non-existent')

      expect(result).toBe(false)
    })

    it('IDが空の場合エラーをスローする', async () => {
      await expect(deleteList('')).rejects.toThrow('リストIDは必須です')
    })
  })

  describe('ListVisibility enum', () => {
    it('正しいvisibility値が定義されている', () => {
      expect(ListVisibility.PUBLIC).toBe('public')
      expect(ListVisibility.PRIVATE).toBe('private')
      expect(ListVisibility.RESTRICTED).toBe('restricted')
    })
  })
})
