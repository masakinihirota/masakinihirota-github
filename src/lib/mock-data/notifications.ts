/**
 * 通知モックデータ
 *
 * @description
 * 静的UIページ開発用の通知モックデータです。
 */

import type { MockNotification } from './types'
import { mockUsers } from './users'

/**
 * 通知モックデータ一覧
 */
export const mockNotifications: MockNotification[] = [
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-12-05T10:30:00Z',
    user_id: mockUsers[0].id,
    type: 'like',
    title: 'いいねされました',
    message: '佐藤花子さんがあなたの投稿「オアシス宣言について考える」にいいねしました',
    link: '/content/880e8400-e29b-41d4-a716-446655440001',
    is_read: false,
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440002',
    created_at: '2024-12-05T09:15:00Z',
    user_id: mockUsers[0].id,
    type: 'comment',
    title: 'コメントされました',
    message: '山田次郎さんがあなたの投稿にコメントしました',
    link: '/content/880e8400-e29b-41d4-a716-446655440001#comments',
    is_read: false,
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440003',
    created_at: '2024-12-04T16:45:00Z',
    user_id: mockUsers[0].id,
    type: 'follow',
    title: 'フォローされました',
    message: '鈴木一郎さんがあなたをフォローしました',
    link: '/profile/550e8400-e29b-41d4-a716-446655440003',
    is_read: true,
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440004',
    created_at: '2024-12-04T14:00:00Z',
    user_id: mockUsers[0].id,
    type: 'mention',
    title: 'メンションされました',
    message: '高橋美咲さんがコメントであなたをメンションしました',
    link: '/content/880e8400-e29b-41d4-a716-446655440002#comment-123',
    is_read: true,
  },
  {
    id: 'aa0e8400-e29b-41d4-a716-446655440005',
    created_at: '2024-12-03T10:00:00Z',
    user_id: mockUsers[0].id,
    type: 'system',
    title: 'システムメンテナンスのお知らせ',
    message: '12月10日 2:00〜4:00にシステムメンテナンスを実施します',
    link: '/announcements/maintenance-202412',
    is_read: true,
  },
]

/**
 * ユーザーの通知を取得
 */
export function getUserNotifications(userId: string): MockNotification[] {
  return mockNotifications
    .filter((notification) => notification.user_id === userId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}

/**
 * 未読通知を取得
 */
export function getUnreadNotifications(userId: string): MockNotification[] {
  return getUserNotifications(userId).filter(
    (notification) => !notification.is_read
  )
}

/**
 * 未読通知数を取得
 */
export function getUnreadCount(userId: string): number {
  return getUnreadNotifications(userId).length
}
