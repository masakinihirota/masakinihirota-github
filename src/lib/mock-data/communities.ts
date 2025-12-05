/**
 * コミュニティモックデータ
 *
 * @description
 * 静的UIページ開発用のコミュニティモックデータです。
 * Supabase communitiesテーブルと互換性のある形式で定義しています。
 */

import type { MockCommunity, MockCommunityMember } from './types'
import { mockUsers } from './users'

/**
 * コミュニティモックデータ一覧
 */
export const mockCommunities: MockCommunity[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-11-01T15:30:00Z',
    name: 'オアシス宣言コミュニティ',
    description:
      'VNSの基本理念である「オアシス宣言」に共感するメンバーが集まるコミュニティです。価値観に基づく議論と活動を行っています。',
    owner_id: mockUsers[0].id,
    member_count: 128,
    is_public: true,
    cover_image_url: '/covers/community-01.jpg',
    tags: ['価値観', 'オアシス宣言', '公式'],
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    created_at: '2024-02-15T14:20:00Z',
    updated_at: '2024-10-28T11:00:00Z',
    name: 'デザイン研究会',
    description:
      'UIデザイン、UXデザイン、アクセシビリティについて学び合うコミュニティです。初心者歓迎！',
    owner_id: mockUsers[1].id,
    member_count: 56,
    is_public: true,
    cover_image_url: '/covers/community-02.jpg',
    tags: ['デザイン', 'UI', 'UX', 'アクセシビリティ'],
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-11-15T08:45:00Z',
    name: '技術交流会',
    description:
      'Web開発、モバイル開発、インフラなど、技術に関する情報交換を行うコミュニティです。',
    owner_id: mockUsers[3].id,
    member_count: 234,
    is_public: true,
    cover_image_url: '/covers/community-03.jpg',
    tags: ['技術', 'プログラミング', 'Web開発'],
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    created_at: '2024-04-05T16:40:00Z',
    updated_at: '2024-09-20T14:00:00Z',
    name: '運営チーム',
    description: 'VNS masakinihirotaの運営メンバー専用コミュニティです。',
    owner_id: mockUsers[0].id,
    member_count: 8,
    is_public: false, // 非公開コミュニティ
    cover_image_url: null,
    tags: ['運営', '内部'],
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    created_at: '2024-05-20T11:30:00Z',
    updated_at: '2024-11-10T17:20:00Z',
    name: '読書クラブ',
    description:
      '月に1冊、課題図書を決めて読み、感想を共有するコミュニティです。ジャンルは問いません。',
    owner_id: mockUsers[4].id,
    member_count: 42,
    is_public: true,
    cover_image_url: '/covers/community-05.jpg',
    tags: ['読書', '書評', '文化'],
  },
]

/**
 * コミュニティメンバーモックデータ
 */
export const mockCommunityMembers: MockCommunityMember[] = [
  // オアシス宣言コミュニティのメンバー
  {
    id: '770e8400-e29b-41d4-a716-446655440001',
    community_id: mockCommunities[0].id,
    user_id: mockUsers[0].id,
    joined_at: '2024-01-20T10:00:00Z',
    role: 'owner',
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    community_id: mockCommunities[0].id,
    user_id: mockUsers[1].id,
    joined_at: '2024-01-25T14:30:00Z',
    role: 'admin',
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440003',
    community_id: mockCommunities[0].id,
    user_id: mockUsers[2].id,
    joined_at: '2024-02-10T09:00:00Z',
    role: 'member',
  },
  // デザイン研究会のメンバー
  {
    id: '770e8400-e29b-41d4-a716-446655440004',
    community_id: mockCommunities[1].id,
    user_id: mockUsers[1].id,
    joined_at: '2024-02-15T14:20:00Z',
    role: 'owner',
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440005',
    community_id: mockCommunities[1].id,
    user_id: mockUsers[0].id,
    joined_at: '2024-02-20T11:00:00Z',
    role: 'member',
  },
]

/**
 * 公開コミュニティのみ取得
 */
export function getPublicCommunities(): MockCommunity[] {
  return mockCommunities.filter((community) => community.is_public)
}

/**
 * IDでコミュニティを検索
 */
export function findCommunityById(id: string): MockCommunity | undefined {
  return mockCommunities.find((community) => community.id === id)
}

/**
 * コミュニティ名で検索（部分一致）
 */
export function searchCommunitiesByName(query: string): MockCommunity[] {
  const lowerQuery = query.toLowerCase()
  return mockCommunities.filter((community) =>
    community.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * タグでコミュニティを検索
 */
export function searchCommunitiesByTag(tag: string): MockCommunity[] {
  const lowerTag = tag.toLowerCase()
  return mockCommunities.filter((community) =>
    community.tags.some((t) => t.toLowerCase().includes(lowerTag))
  )
}

/**
 * ユーザーが所属するコミュニティを取得
 */
export function getUserCommunities(userId: string): MockCommunity[] {
  const membershipIds = mockCommunityMembers
    .filter((member) => member.user_id === userId)
    .map((member) => member.community_id)

  return mockCommunities.filter((community) =>
    membershipIds.includes(community.id)
  )
}

/**
 * コミュニティのメンバー一覧を取得
 */
export function getCommunityMembers(communityId: string): MockCommunityMember[] {
  return mockCommunityMembers.filter(
    (member) => member.community_id === communityId
  )
}
