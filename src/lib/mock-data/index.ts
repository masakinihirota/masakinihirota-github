/**
 * モックデータ エクスポート集約
 *
 * @description
 * 静的UIページ開発用のモックデータを一括でエクスポートします。
 *
 * 使用方法:
 * ```tsx
 * import { mockUsers, mockCommunities, mockCurrentUser } from '@/lib/mock-data'
 * ```
 *
 * または個別インポート:
 * ```tsx
 * import { mockUsers, findUserById } from '@/lib/mock-data/users'
 * ```
 */

// 型定義
export type {
  MockUser,
  MockPublicProfile,
  MockCommunity,
  MockCommunityMember,
  MockContent,
  MockComment,
  MockNotification,
  MockOrganization,
  MockValueDeclaration,
  MockPaginatedResponse,
  MockApiResponse,
} from './types'

// ユーザー関連
export {
  mockUsers,
  mockCurrentUser,
  toPublicProfile,
  findUserById,
  searchUsersByName,
} from './users'

// コミュニティ関連
export {
  mockCommunities,
  mockCommunityMembers,
  getPublicCommunities,
  findCommunityById,
  searchCommunitiesByName,
  searchCommunitiesByTag,
  getUserCommunities,
  getCommunityMembers,
} from './communities'

// コンテンツ関連
export {
  mockContents,
  mockComments,
  getPublishedContents,
  findContentById,
  getCommunityContents,
  getUserContents,
  getContentComments,
  searchContentsByTag,
  searchContents,
} from './contents'

// 通知関連
export {
  mockNotifications,
  getUserNotifications,
  getUnreadNotifications,
  getUnreadCount,
} from './notifications'
