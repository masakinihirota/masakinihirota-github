/**
 * ユーザーモックデータ
 *
 * @description
 * 静的UIページ開発用のユーザーモックデータです。
 * Supabase profilesテーブルと互換性のある形式で定義しています。
 */

import type { MockUser, MockPublicProfile } from './types'

/**
 * ユーザーモックデータ一覧
 */
export const mockUsers: MockUser[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-06-20T14:30:00Z',
    display_name: '田中太郎',
    avatar_url: '/avatars/user-01.png',
    bio: 'VNSコミュニティの創設メンバーです。オアシス宣言に共感し、価値観に基づくコミュニティ形成を目指しています。',
    email: 'tanaka@example.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    created_at: '2024-02-10T11:30:00Z',
    updated_at: '2024-07-15T08:45:00Z',
    display_name: '佐藤花子',
    avatar_url: '/avatars/user-02.png',
    bio: 'デザイナーとして活動しています。UIデザインとアクセシビリティに興味があります。',
    email: 'sato@example.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    created_at: '2024-03-05T16:20:00Z',
    updated_at: '2024-08-01T10:00:00Z',
    display_name: '鈴木一郎',
    avatar_url: null, // アバター未設定のケース
    bio: null, // 自己紹介未設定のケース
    email: 'suzuki@example.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    created_at: '2024-04-20T08:00:00Z',
    updated_at: '2024-09-10T12:15:00Z',
    display_name: '山田次郎',
    avatar_url: '/avatars/user-04.png',
    bio: 'エンジニアです。Next.jsとSupabaseを使った開発が得意です。',
    email: 'yamada@example.com',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    created_at: '2024-05-12T14:45:00Z',
    updated_at: '2024-10-05T09:30:00Z',
    display_name: '高橋美咲',
    avatar_url: '/avatars/user-05.png',
    bio: 'コミュニティマネージャーとして、様々なコミュニティの運営をサポートしています。',
    email: 'takahashi@example.com',
  },
]

/**
 * 現在のログインユーザー（モック）
 * @description UIプレビュー時に「自分」として扱うユーザー
 */
export const mockCurrentUser: MockUser = mockUsers[0]

/**
 * 公開プロファイル形式に変換
 */
export function toPublicProfile(user: MockUser): MockPublicProfile {
  return {
    id: user.id,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    bio: user.bio,
  }
}

/**
 * IDでユーザーを検索
 */
export function findUserById(id: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === id)
}

/**
 * ユーザー名で検索（部分一致）
 */
export function searchUsersByName(query: string): MockUser[] {
  const lowerQuery = query.toLowerCase()
  return mockUsers.filter((user) =>
    user.display_name.toLowerCase().includes(lowerQuery)
  )
}
