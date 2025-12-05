# 表示名システム（Display Name System）実装完了レポート

## 日付: 2025-12-05

## 概要
要件定義書 `0009-表示名システム要件定義書.md` に基づき、表示名システムのコア機能を実装しました。

## 完了したタスク

### 1. スキーマ設計・DB拡張
- `src/db/constants.ts` に新しいEnum定義を追加:
  - `DisplayNameType`: BlueName, UnverifiedRealName, NetName, Anonymous
  - `VenueDisplayRule`: Free, RealNameOnly, AnonymousOnly, UnifiedNetName
  - `PoeticIdPoolType`: Default, Japanese, Western, SciFi, Custom
  - `AnonymousIdDisplay`: Hidden, Optional, Required

- `src/db/schema.ts` に新しいテーブルを追加:
  - `poeticIdPools`: 詩的ID単語プールテーブル
  - `poeticIds`: 生成された詩的IDテーブル
  - `venueDisplayRules`: 場所の表示名ルール設定テーブル
  - `bannedWords`: 禁止ワードリストテーブル

- 既存テーブルにカラム追加:
  - `rootAccounts`: realName, realNameVerified, defaultDisplayNameType
  - `profiles`: poeticIdId, displayNameType, isIdPublic

### 2. 詩的ID単語プール定義
- `src/data/poetic-id-words.ts`
  - DEFAULT_ADJECTIVES, DEFAULT_QUALITIES, DEFAULT_NOUNS
  - JAPANESE_ADJECTIVES, JAPANESE_QUALITIES, JAPANESE_NOUNS
  - WESTERN_ADJECTIVES, WESTERN_QUALITIES, WESTERN_NOUNS
  - SCIFI_ADJECTIVES, SCIFI_QUALITIES, SCIFI_NOUNS
  - 形式: 形容詞 + 色/質感 + 名詞 (例: "黒き闇の騎士")

### 3. 詩的ID生成ロジック（TDD実装）
- `src/lib/display-name/poetic-id-generator.ts`
  - `generatePoeticId()`: 詩的ID生成
  - `generatePoeticIdCandidates()`: 複数候補生成
  - `validatePoeticId()`: 詩的ID検証
- `src/lib/display-name/poetic-id-generator.test.ts`
  - **12テスト全てパス**

### 4. 表示名解決ロジック（TDD実装）
- `src/lib/display-name/display-name-resolver.ts`
  - `resolveDisplayName()`: 表示名解決（場所ルール > プロフィール > ルートアカウント）
  - `formatDisplayName()`: 表示名フォーマット
  - `getDisplayNameStyle()`: 表示名スタイル取得
- `src/lib/display-name/display-name-resolver.test.ts`
  - **14テスト全てパス**

### 5. 表示名表示コンポーネント（TDD実装）
- `src/components/display-name/DisplayName.tsx`
  - Props: displayName, type, poeticId, isVerified, size
  - サイズバリエーション: small, medium, large
  - Blueネーム（認証済み実名）は青色表示＋認証バッジ
- `src/components/display-name/DisplayName.test.tsx`
  - **11テスト全てパス**
- `src/components/display-name/index.ts`: エクスポート

### 6. スタイル設定
- `src/app/globals.css` に `--color-oasis` 追加（Blue Name用）

## テスト結果
- **表示名システム関連テスト**: 37テスト全てパス
  - poetic-id-generator.test.ts: 12テスト
  - display-name-resolver.test.ts: 14テスト
  - DisplayName.test.tsx: 11テスト

## マイグレーション
- `drizzle/0006_display_name_system.sql` 生成済み
  - 新テーブル作成SQL
  - インデックス設定
  - 外部キー制約

## 表示名タイプ優先順位
1. **Blueネーム（認証済み実名）**: 青色表示、認証バッジ、詩的ID不要
2. **未認証実名**: 実名表示 + 詩的ID（半透明）
3. **ネットネーム**: ネットネーム表示 + 詩的ID
4. **匿名**: 匿名表示、詩的ID不要

## 場所ルール
- `Free`: ユーザー設定に従う
- `RealNameOnly`: 実名強制（未登録は参加不可）
- `AnonymousOnly`: 匿名限定
- `UnifiedNetName`: 統一ネットネーム

## 今後のタスク
- [ ] プロフィール編集フォームへの表示名タイプ選択機能追加
- [ ] 場所ルール設定UI
- [ ] 詩的ID選択・変更機能
- [ ] 実名認証フロー（本人確認）
- [ ] 禁止ワード管理機能
