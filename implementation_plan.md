# VNS masakinihirota MVP 実装計画書

## 1. プロジェクト概要
**VNS (Value Network Service) masakinihirota** の MVP (Minimum Viable Product) を構築します。
本プロジェクトは、価値観に基づくコミュニティ形成（組織・国家）を支援するプラットフォームです。
「全体要件定義書」に基づき、テスト駆動開発 (TDD) で実装を進めます。

## 2. 技術スタック (確定版)
*   **Frontend/Framework**: Next.js 15.5.2 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4, Shadcn/UI
*   **Database**: PostgreSQL (Supabase Local)
*   **ORM**: Drizzle ORM
*   **Auth**: Supabase Auth (Google OAuth)
*   **Testing**: Vitest + React Testing Library (TDD)
*   **Deployment**: Vercel (予定)

## 3. 開発方針
*   **テスト駆動開発 (TDD)**: RED -> GREEN -> REFACTOR のサイクルを徹底する。
*   **コロケーション (Co-location)**: 機能単位でファイル (コンポーネント, ロジック, テスト) をまとめる。
*   **ディレクトリ構造**: `src/app/(順序-機能名)/` の形式を採用し、メニュー順序を反映させる。

## 4. 実装フェーズと進捗

### Phase 1: 環境構築と基盤 (完了)
- [x] Next.js 15.5.2 プロジェクト初期化
- [x] 開発依存関係のインストール
- [x] データベース設定 (Supabase Local / PostgreSQL)
- [x] Drizzle ORM 設定
- [x] 基本スキーマ定義 (Users, RootAccounts, Profiles, Works, Values, Organizations, Nations)

### Phase 2: 認証とユーザー管理 (完了)
- [x] Supabase Auth 実装
- [x] DBマイグレーション & Auth Trigger
- [x] ログイン画面 (Google Auth)
- [x] ルートアカウント作成 (オンボーディング)
    - 初期設定モーダル (居住地域, 母語, 生誕世代, オアシス宣誓)

### Phase 3: ユーザープロフィール管理 (現在)
要件定義書 2.1.3 に基づき実装。

#### 3.0 構造修正 (優先)
- [ ] **ディレクトリ構成の適正化**
    - [x] `src/app/protected/page.tsx` を `src/app/(protected)/dashboard/page.tsx` に移動
    - [x] ログイン後のリダイレクト先を `/protected` から `/dashboard` に変更
    - [x] 関連するテスト (`google-login-form.test.tsx`) の修正

#### 3.1 マスタデータ整備
- [x] **シードデータ作成 & 統合**
    - [x] `src/db/seeds/works.ts` (作品データ) — データを `supabase/seed/04_works.sql` に統合
    - [x] `src/db/seeds/values.ts` (価値観データ) — データを `supabase/seed/01_reference.sql` に統合
    - [x] `package.json` にシード実行コマンド追加 (`pnpm db:seed`) — TypeScript/Drizzle 版を廃止
    - [x] TypeScript/Drizzle シードは `supabase/seed/legacy/` にアーカイブし、コード上では非推奨化（プレースホルダ）しました。

#### 3.2 ユーザープロフィール作成機能 (TDD)
- [ ] **Server Action 実装** (`src/app/(protected)/(3-profile)/create/_actions/create-profile.ts`)
    - [ ] [RED] テスト作成 (`create-profile.test.ts`)
        - ケース: 未認証, バリデーションエラー, 正常系(組織自動作成含む)
    - [ ] [GREEN] 実装
    - [ ] [REFACTOR] リファクタリング
- [ ] **UI 実装** (`src/app/(protected)/(3-profile)/create/page.tsx`)
    - [ ] プロフィール基本情報入力フォーム
    - [ ] 役割・目的・種類選択
    - [ ] 組織自動作成の確認

### Phase 4: 組織 (Organization) 管理
要件定義書 2.1.8 に基づき実装。
- [ ] **組織管理機能**
    - [ ] 組織詳細設定 (リーダーのみ)
    - [ ] メンバー管理 (招待, 承認, 追放)
- [ ] **マッチング機能** (要件定義書 2.1.6)
    - [ ] 自動マッチングロジック (Batch/Trigger)
    - [ ] 手動マッチング・検索 UI

### Phase 5: 国 (Nation) 管理
要件定義書 2.1.9 に基づき実装。
- [ ] **建国機能**
    - [ ] 国作成フロー (ポイント消費)
    - [ ] ルール設定
- [ ] **国への参加**
    - [ ] 入国 (一時参加) フロー
    - [ ] 常駐 (定住) フロー

## 5. 次のステップ
Phase 3 のマスタデータ整備とユーザープロフィール作成機能の実装に着手します。

---

## MVP 実装チェックリスト (最小限)
以下は MVP の最小実装項目で、段階的に完了させるためのチェックリストです。

1. 基盤と安全策（完了）
    - [x] CI に production build を通す仕組みを持たせる
    - [x] クライアント側でサーバ専用 import をしてしまうミスを検知するチェックスクリプト (`scripts/check-client-imports.js`) を追加
    - [x] README に境界ルールとスクリプトの実行方法を追記

2. 作品 & プロフィール 操作（完了）
    - [x] Work 作成サーバアクション + CreateWork UI + tests
    - [x] Work 検索アクション + client wrapper + tests
    - [x] Profile 作成 + 選択作品の upsert (ProfileWork) + tests

3. 評価集計・ジョブ（完了）
    - [x] `computeWorkAggregates` 集計ロジック、テーブル、バッチスクリプト を実装
    - [x] 集計の統合テストと CI ワークフローを追加

4. マッチング（MVP実装）
    - [x] 最小限のマッチングロジック (`computeMatchesForProfile`) を実装（pure logic + unit tests）
    - [x] サーバアクション (`computeMatches`) を追加し、integration test を用意
    - [x] CI で matching の integration test を実行するようにワークフローを更新

5. 検証とリリース準備
    - [x] 全テスト（unit/ui）と production build を実行し合格
    - [ ] ドキュメント整理とリリースノート作成（本タスク: 残り）

---

現状: 上記の MVP チェックリスト 1-4 は完了しました。次は最終ドキュメント整理／PR／リリースノート作成を進め、MVP を正式にまとめます。
