# 実装計画書 (Implementation Plan)

## 概要
`0000_ordinary_freak.sql` で指摘されたデータベーススキーマの問題点を修正し、堅牢性と移植性を向上させます。

## 変更点

### 1. タイムスタンプの保存形式
- **現状**: `text` 型で `CURRENT_TIMESTAMP` を使用（フォーマット依存）。
- **修正**: `integer` 型（Unix Epoch ミリ秒）に変更。
- **理由**: フォーマット依存を排除し、アプリケーション側での `Date` オブジェクトとの相互変換を容易にするため。
- **実装**: Drizzle の `integer({ mode: 'timestamp' })` を使用。デフォルト値はアプリケーション側で `new Date()` を生成、または DB 側で `(unixepoch() * 1000)` を使用。

### 2. マスタデータ ID の管理
- **現状**: 自由入力の `text` で、マジックストリング（'Village', 'member'）に依存。
- **修正**: アプリケーション定数（Enum）を導入し、スキーマ定義で使用。
- **実装**: `src/db/constants.ts` を作成し、`NationLevel`, `OrganizationRole` などを定義。

### 3. ID 戦略の明確化
- **現状**: UUID と自然キーが混在し、定義が不明確。
- **修正**: ID の生成規則と検証ルールを文書化。
- **方針**:
    - システムエンティティ（User, Profile 等）: UUID v4
    - 参照/マスタデータ: Human-readable Slugs (Enum)
- **実装**: `src/db/schema.ts` にコメントとして戦略を記述。

### 4. リーダー参照の一貫性
- **課題**: `nations.leader_organization_id` や `organizations.leader_profile_id` が、それぞれのメンバーシップテーブル（`nation_memberships`, `organization_members`）に含まれていない矛盾が発生しうる。
- **対応**: **アプリケーションロジック（トランザクション）で整合性を担保する。**
    - DBトリガー等は使用せず、明示的なコード管理とする。
    - **TDD要件**: 組織や国家の作成・更新時には、必ず「リーダーがメンバーとして登録されていること」を検証するテストケースを作成する。

## 実行済みの作業
- [x] `src/db/constants.ts` の作成
- [x] `src/db/schema.ts` の修正（Timestamp, Enums, Comments）
- [x] マイグレーションの生成 (`0001_powerful_marvel_apes.sql`)
- [x] DBレビュー指摘対応（ENUM廃止、初期データ投入、CASCADE設定、updated_at追加）
- [x] Authユーザー同期トリガーの修正（自動マイグレーションからの除外、手動SQL作成）
- [x] ローカル開発環境におけるAuthトリガー自動適用スクリプトの作成と設定

## 今後のステップ
- アプリケーションロジックでのバリデーション実装（Zod スキーマなど）。
- 各機能実装時におけるリーダー整合性チェックのTDD実装。
