/**
 * コンテンツモックデータ
 *
 * @description
 * 静的UIページ開発用のコンテンツ（投稿）モックデータです。
 * Supabase contentsテーブルと互換性のある形式で定義しています。
 */

import type { MockContent, MockComment } from './types'
import { mockUsers } from './users'
import { mockCommunities } from './communities'

/**
 * コンテンツモックデータ一覧
 */
export const mockContents: MockContent[] = [
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-10-15T10:30:00Z',
    updated_at: '2024-10-15T10:30:00Z',
    author_id: mockUsers[0].id,
    community_id: mockCommunities[0].id,
    title: 'オアシス宣言について考える',
    body: `# オアシス宣言とは

オアシス宣言は、VNSコミュニティの基本理念を定めた文書です。

## 主なポイント

1. **価値観の尊重**: 個人の価値観を尊重し、多様性を認め合う
2. **対話の重視**: 建設的な対話を通じて相互理解を深める
3. **共創の精神**: 共に創り上げていくコミュニティ

皆さんの意見をお聞かせください。`,
    status: 'published',
    like_count: 45,
    comment_count: 12,
    tags: ['オアシス宣言', '価値観', 'コミュニティ'],
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    created_at: '2024-10-20T14:00:00Z',
    updated_at: '2024-10-21T09:15:00Z',
    author_id: mockUsers[1].id,
    community_id: mockCommunities[1].id,
    title: 'アクセシビリティを意識したUIデザイン入門',
    body: `# アクセシビリティとは

Webアクセシビリティとは、障害の有無に関わらず、すべての人がWebサイトを利用できるようにすることです。

## 基本的なチェックポイント

- コントラスト比 4.5:1 以上
- キーボード操作のサポート
- 適切な代替テキスト
- 明確なフォーカス表示

## 参考リソース

- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [デジタル庁デザインシステム](https://design.digital.go.jp/)`,
    status: 'published',
    like_count: 78,
    comment_count: 23,
    tags: ['アクセシビリティ', 'UI', 'デザイン', 'WCAG'],
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    created_at: '2024-11-01T16:45:00Z',
    updated_at: '2024-11-01T16:45:00Z',
    author_id: mockUsers[3].id,
    community_id: mockCommunities[2].id,
    title: 'Next.js 15の新機能まとめ',
    body: `# Next.js 15 の新機能

Next.js 15がリリースされました。主な変更点をまとめます。

## 主な新機能

### Partial Prerendering (PPR)
静的コンテンツと動的コンテンツを同一ページで効率的に処理。

### React 19 サポート
最新のReact機能を利用可能に。

### 改善されたキャッシュ
より細かなキャッシュ制御が可能に。

## アップグレード方法

\`\`\`bash
pnpm add next@latest react@latest react-dom@latest
\`\`\``,
    status: 'published',
    like_count: 156,
    comment_count: 34,
    tags: ['Next.js', 'React', 'フロントエンド'],
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    created_at: '2024-11-10T11:20:00Z',
    updated_at: '2024-11-10T11:20:00Z',
    author_id: mockUsers[4].id,
    community_id: mockCommunities[4].id,
    title: '11月の課題図書「人間失格」読書会のお知らせ',
    body: `# 11月読書会のお知らせ

今月の課題図書は太宰治の「人間失格」です。

## 読書会詳細

- **日時**: 11月30日（土）14:00〜16:00
- **場所**: オンライン（Zoomリンクは後日共有）
- **課題図書**: 人間失格（太宰治）

## 参加方法

コメント欄に「参加します」と書いてください。
初参加の方も大歓迎です！`,
    status: 'published',
    like_count: 23,
    comment_count: 8,
    tags: ['読書会', '太宰治', '文学'],
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440005',
    created_at: '2024-11-15T09:00:00Z',
    updated_at: '2024-11-15T09:00:00Z',
    author_id: mockUsers[0].id,
    community_id: null, // 個人投稿（コミュニティに属さない）
    title: '下書きテスト記事',
    body: `# これは下書きです

まだ公開していない記事のテストです。`,
    status: 'draft', // 下書き状態
    like_count: 0,
    comment_count: 0,
    tags: ['テスト'],
  },
]

/**
 * コメントモックデータ
 */
export const mockComments: MockComment[] = [
  {
    id: '990e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-10-15T12:00:00Z',
    updated_at: '2024-10-15T12:00:00Z',
    content_id: mockContents[0].id,
    author_id: mockUsers[1].id,
    parent_id: null,
    body: '素晴らしいまとめですね！オアシス宣言の理念に共感します。',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440002',
    created_at: '2024-10-15T13:30:00Z',
    updated_at: '2024-10-15T13:30:00Z',
    content_id: mockContents[0].id,
    author_id: mockUsers[0].id,
    parent_id: '990e8400-e29b-41d4-a716-446655440001', // 返信
    body: 'ありがとうございます！ぜひ一緒に広めていきましょう。',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440003',
    created_at: '2024-10-20T15:45:00Z',
    updated_at: '2024-10-20T15:45:00Z',
    content_id: mockContents[1].id,
    author_id: mockUsers[3].id,
    parent_id: null,
    body: 'コントラスト比のチェックツール、おすすめはありますか？',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440004',
    created_at: '2024-10-20T16:10:00Z',
    updated_at: '2024-10-20T16:10:00Z',
    content_id: mockContents[1].id,
    author_id: mockUsers[1].id,
    parent_id: '990e8400-e29b-41d4-a716-446655440003',
    body: 'Chrome DevToolsの「Lighthouse」や「axe DevTools」がおすすめです！',
  },
]

/**
 * 公開済みコンテンツのみ取得
 */
export function getPublishedContents(): MockContent[] {
  return mockContents.filter((content) => content.status === 'published')
}

/**
 * IDでコンテンツを検索
 */
export function findContentById(id: string): MockContent | undefined {
  return mockContents.find((content) => content.id === id)
}

/**
 * コミュニティのコンテンツを取得
 */
export function getCommunityContents(communityId: string): MockContent[] {
  return mockContents.filter(
    (content) =>
      content.community_id === communityId && content.status === 'published'
  )
}

/**
 * ユーザーの投稿を取得
 */
export function getUserContents(
  userId: string,
  includeUnpublished = false
): MockContent[] {
  return mockContents.filter(
    (content) =>
      content.author_id === userId &&
      (includeUnpublished || content.status === 'published')
  )
}

/**
 * コンテンツのコメントを取得
 */
export function getContentComments(contentId: string): MockComment[] {
  return mockComments.filter((comment) => comment.content_id === contentId)
}

/**
 * タグでコンテンツを検索
 */
export function searchContentsByTag(tag: string): MockContent[] {
  const lowerTag = tag.toLowerCase()
  return mockContents.filter(
    (content) =>
      content.status === 'published' &&
      content.tags.some((t) => t.toLowerCase().includes(lowerTag))
  )
}

/**
 * キーワードでコンテンツを検索（タイトルと本文）
 */
export function searchContents(query: string): MockContent[] {
  const lowerQuery = query.toLowerCase()
  return mockContents.filter(
    (content) =>
      content.status === 'published' &&
      (content.title.toLowerCase().includes(lowerQuery) ||
        content.body.toLowerCase().includes(lowerQuery))
  )
}
