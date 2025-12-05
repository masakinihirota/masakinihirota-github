/**
 * モックデータ型定義
 *
 * @description
 * このファイルは静的UIページ開発用のモックデータ型を定義します。
 * Supabase接続時にスムーズに移行できるよう、実際のDBスキーマと互換性のある形式で定義しています。
 *
 * 使用場面:
 * - 静的UIページのプレビュー
 * - コンポーネントのStorybook表示
 * - ユニットテスト
 *
 * 注意:
 * - id は UUID 形式（例: "550e8400-e29b-41d4-a716-446655440001"）
 * - 日時は ISO 8601 形式（例: "2024-01-15T09:00:00Z"）
 * - 外部キーは対応するテーブルの id を参照
 */

// =============================================================================
// ユーザー関連
// =============================================================================

/**
 * ユーザープロファイル型
 * @description Supabase profiles テーブルと互換
 */
export type MockUser = {
  /** UUID形式のユーザーID */
  id: string
  /** レコード作成日時 (ISO 8601) */
  created_at: string
  /** レコード更新日時 (ISO 8601) */
  updated_at: string
  /** 表示名 */
  display_name: string
  /** アバター画像URL（nullの場合はデフォルトアバターを表示） */
  avatar_url: string | null
  /** 自己紹介文 */
  bio: string | null
  /** メールアドレス（認証用、通常は非表示） */
  email?: string
}

/**
 * ユーザーの公開プロファイル型（他ユーザーから見える情報のみ）
 */
export type MockPublicProfile = Pick<
  MockUser,
  'id' | 'display_name' | 'avatar_url' | 'bio'
>

// =============================================================================
// コミュニティ関連
// =============================================================================

/**
 * コミュニティ型
 * @description Supabase communities テーブルと互換
 */
export type MockCommunity = {
  /** UUID形式のコミュニティID */
  id: string
  /** レコード作成日時 (ISO 8601) */
  created_at: string
  /** レコード更新日時 (ISO 8601) */
  updated_at: string
  /** コミュニティ名 */
  name: string
  /** コミュニティの説明 */
  description: string | null
  /** 作成者のユーザーID（MockUser.idへの外部キー） */
  owner_id: string
  /** メンバー数（集計値） */
  member_count: number
  /** 公開設定 */
  is_public: boolean
  /** カバー画像URL */
  cover_image_url: string | null
  /** タグ（検索・フィルタ用） */
  tags: string[]
}

/**
 * コミュニティメンバー型
 * @description コミュニティとユーザーの中間テーブル
 */
export type MockCommunityMember = {
  /** UUID */
  id: string
  /** コミュニティID（MockCommunity.idへの外部キー） */
  community_id: string
  /** ユーザーID（MockUser.idへの外部キー） */
  user_id: string
  /** 参加日時 (ISO 8601) */
  joined_at: string
  /** メンバーの役割 */
  role: 'owner' | 'admin' | 'moderator' | 'member'
}

// =============================================================================
// コンテンツ関連
// =============================================================================

/**
 * 投稿/コンテンツ型
 * @description Supabase contents テーブルと互換
 */
export type MockContent = {
  /** UUID形式のコンテンツID */
  id: string
  /** レコード作成日時 (ISO 8601) */
  created_at: string
  /** レコード更新日時 (ISO 8601) */
  updated_at: string
  /** 投稿者のユーザーID（MockUser.idへの外部キー） */
  author_id: string
  /** 所属コミュニティID（MockCommunity.idへの外部キー、nullの場合は個人投稿） */
  community_id: string | null
  /** タイトル */
  title: string
  /** 本文（Markdown形式） */
  body: string
  /** 公開状態 */
  status: 'draft' | 'published' | 'archived'
  /** いいね数（集計値） */
  like_count: number
  /** コメント数（集計値） */
  comment_count: number
  /** タグ */
  tags: string[]
}

/**
 * コメント型
 */
export type MockComment = {
  /** UUID */
  id: string
  /** レコード作成日時 (ISO 8601) */
  created_at: string
  /** レコード更新日時 (ISO 8601) */
  updated_at: string
  /** コンテンツID（MockContent.idへの外部キー） */
  content_id: string
  /** 投稿者のユーザーID（MockUser.idへの外部キー） */
  author_id: string
  /** 親コメントID（返信の場合、nullの場合はトップレベルコメント） */
  parent_id: string | null
  /** コメント本文 */
  body: string
}

// =============================================================================
// 通知関連
// =============================================================================

/**
 * 通知型
 */
export type MockNotification = {
  /** UUID */
  id: string
  /** 通知作成日時 (ISO 8601) */
  created_at: string
  /** 通知先ユーザーID（MockUser.idへの外部キー） */
  user_id: string
  /** 通知タイプ */
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system'
  /** 通知タイトル */
  title: string
  /** 通知本文 */
  message: string
  /** 関連リソースへのリンク */
  link: string | null
  /** 既読フラグ */
  is_read: boolean
}

// =============================================================================
// 組織・国家関連（VNS固有）
// =============================================================================

/**
 * 組織型
 * @description VNS独自の組織構造
 */
export type MockOrganization = {
  /** UUID */
  id: string
  /** レコード作成日時 (ISO 8601) */
  created_at: string
  /** レコード更新日時 (ISO 8601) */
  updated_at: string
  /** 組織名 */
  name: string
  /** 組織の説明 */
  description: string | null
  /** 親組織ID（階層構造の場合） */
  parent_id: string | null
  /** 組織タイプ */
  type: 'nation' | 'region' | 'city' | 'district'
  /** メンバー数 */
  member_count: number
}

/**
 * 価値観宣言型
 * @description VNS独自の価値観システム
 */
export type MockValueDeclaration = {
  /** UUID */
  id: string
  /** 作成日時 (ISO 8601) */
  created_at: string
  /** 宣言者のユーザーID */
  user_id: string
  /** 価値観カテゴリ */
  category: string
  /** 価値観の内容 */
  statement: string
  /** 公開設定 */
  is_public: boolean
}

// =============================================================================
// ユーティリティ型
// =============================================================================

/**
 * ページネーション用のレスポンス型
 */
export type MockPaginatedResponse<T> = {
  /** データ配列 */
  data: T[]
  /** 総件数 */
  total_count: number
  /** 現在のページ番号（1始まり） */
  page: number
  /** 1ページあたりの件数 */
  per_page: number
  /** 次のページが存在するか */
  has_next: boolean
  /** 前のページが存在するか */
  has_previous: boolean
}

/**
 * API レスポンスのラッパー型
 */
export type MockApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } }
