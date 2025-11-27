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
- [x] **ディレクトリ構成の適正化**
    - [x] `src/app/protected/page.tsx` を `src/app/(protected)/dashboard/page.tsx` に移動
    - [x] ログイン後のリダイレクト先を `/protected` から `/dashboard` に変更
    - [x] 関連するテスト (`google-login-form.test.tsx`) の修正

#### 3.1 マスタデータ整備
- [x] **シードデータ作成 & 統合**
    - [x] `src/db/seeds/works.ts` (作品データ) — データを `supabase/seed/04_works.sql` に統合
    - [x] `src/db/seeds/values.ts` (価値観データ) — データを `supabase/seed/01_reference.sql` に統合
    - [x] `package.json` にシード実行コマンド追加 (`pnpm db:seed`) — TypeScript/Drizzle 版を廃止
    - [x] TypeScript/Drizzle シードは `supabase/seed/*.sql` に統合しました。旧シードのアーカイブは行われましたが、最終的に `supabase/seed/legacy/` の内容は恒久削除しました。

#### 3.2 ユーザープロフィール作成機能 (TDD)
- [ ] **Server Action 実装** (`src/app/(protected)/(3-profile)/create/_actions/create-profile.ts`)
    - [ ] [RED] テスト作成 (`create-profile.test.ts`)
        - ケース: 未認証, 入力バリデーション, 正常系(組織自動作成含む)
    - [ ] [GREEN] 実装
    - [ ] [REFACTOR] リファクタリング
- [ ] **基本情報 UI** (`src/app/(protected)/(3-profile)/create/page.tsx`)
    - [ ] 役割・目的・種類フォームと複数目的選択
    - [ ] サーバーアクション連携とエラーハンドリング
    - [ ] リーダー選択時の自動組織生成確認モーダル
- [ ] **価値観回答フロー**
    - [ ] 質問マスタ読み込みと表示
    - [ ] 回答入力バリデーションとサーバー保存
    - [ ] 未完了時のガード処理
- [ ] **スキル・チャート & 目標設定**
    - [ ] スキル入力フォームと要求スキルの管理
    - [ ] マンダラチャート（最小構成）の入力データ保存
- [ ] **外部連携・連絡先**
    - [ ] 外部SNSリンク追加・削除 UI
    - [ ] URL バリデーションと保存ロジック
- [ ] **公開形式 / 表示切替**
    - [ ] 名刺・履歴書・フル表示の切替 UI
    - [ ] 表示モードごとのデータ整形ロジック
- [ ] **プロフィール数制限**
    - [ ] 無料/有料プラン別上限チェック
    - [ ] ルートアカウント単位の作成ガード

#### 3.3 作品登録・評価機能 (TDD)
- [ ] **作品カタログ登録**
    - [ ] [RED] カタログ登録テスト（公式登録・ユーザー登録）
    - [ ] [GREEN] 登録アクションと承認待ちステータス実装
    - [ ] [REFACTOR] 管理者権限の抽象化
- [ ] **作品基本情報管理**
    - [ ] タイトル・作者・年代・カテゴリ/ジャンル入力
    - [ ] アフィリエイトURL・紹介URLの検証
- [ ] **プロフィールへの作品追加**
    - [ ] 作品検索・選択 UI
    - [ ] プロフィールとの紐付けサーバーアクション
- [ ] **状態・Tier 評価**
    - [ ] 今/人生/未来 ステータス変更テストと実装
    - [ ] Tier1-3 / 普通 / 合わない 評価ロジック
- [ ] **拍手機能の最小実装**
    - [ ] スキ（自分用）と拍手（公開）のポイント処理
    - [ ] 拍手時のポイント減算テスト

### Phase 3.5: アクセス権限管理 (RBAC) システム構築 (新規)
要件定義書／設計書: 0012-01, 0012-03, 0014-01, 0014-02, 0016-01, 0016-02, 0022-01 に基づき TDD で実装する。

#### 3.5.1 スキーマ拡張 (Drizzle + Supabase)
- [ ] **RBAC コアテーブル定義**
    - [ ] [RED] `acl_permissions`, `acl_roles`, `acl_role_permissions` のマイグレーションテスト作成 (権限コード一意, スコープ enum)
    - [ ] [GREEN] Drizzle スキーマ & SQL マイグレーション実装
    - [ ] [REFACTOR] インデックス／コメント整備
- [ ] **階層・割当テーブル定義**
    - [ ] `acl_groups`, `acl_group_closure`, `acl_group_role_assignments` のマイグレーション TDD (階層整合性制約, 調停者フラグ)
    - [ ] `acl_nation_role_assignments`, `acl_exception_grants`, `user_authorization_permissions` (マテビュー) の追加
- [ ] **既存テーブル連携**
    - [ ] `organization_members`, `topdown_nation_memberships` への外部キー/列追加テスト
    - [ ] JWT claims で利用する enum/型を `drizzle/schema/root_accounts/enums.ts` へ統合

#### 3.5.2 シードデータ & マスタ投入
- [ ] **権限カタログ (AC Catalogue)**
    - [ ] [RED] `supabase/seed/05_acl_permissions.sql` の期待行数テスト (R1〜R7 スコープ別)
    - [ ] [GREEN] 権限コード実データ投入 (システム / 組織 / 国 / 監査 / Ledger)
    - [ ] [REFACTOR] コメント・カテゴリ整理
- [ ] **ロール初期値**
    - [ ] システムロール: R1 (Super Admin)〜R7 (一般ユーザー)
    - [ ] 組織ロール: Leader/SubLeader/Member, 調停者任務テンプレート
    - [ ] 国ロール: Head/Minister/Citizen, temporary/resident を区別
- [ ] **紐付けデータ**
    - [ ] `acl_role_permissions` のペアリング確認 (AC-U-001 を満たす権限セット)
    - [ ] `user_system_roles` / `acl_group_role_assignments` の初期割当シード (開発用)

#### 3.5.3 RBAC サービス実装 (App Layer)
- [ ] **RBAC 合成サービス (`src/lib/auth/rbac-service.ts`)**
    - [ ] [RED] AC-U-001-01〜04: 基本ロール許可集合 (Vitest)
    - [ ] [RED] AC-U-004/005/016: 否定優先 & 優先度ロジック
    - [ ] [GREEN] `mergeSystemRoles`, `applyDenyRules`
    - [ ] [RED] AC-U-002/003/008/009: 論理ロール & コンテキストフィルタ
    - [ ] [GREEN] `mergeLogicRoles`, `filterByContext`
- [ ] **例外承認フロー (`src/lib/auth/exception-grants.ts`)**
    - [ ] AC-U-006/007, AC-U-019〜023: 例外付与/承認/失効のテスト→実装
    - [ ] AC-B-001: 自動失効ジョブのテストダブル & 実装
- [ ] **キャッシュ/マテビュー管理**
    - [ ] AC-U-010〜015, AC-I-001〜004: `user_authorization_permissions` の再計算ロジック
    - [ ] 配布キャッシュの TTL / invalidation API
- [ ] **公開 API & Server Actions**
    - [ ] `hasPermission`, `requirePermission` の TDD (AC-I-005〜008)
    - [ ] Ledger 操作前ガード (AC-U-024〜028)
- [ ] **監査ログ & トレーサビリティ**
    - [ ] AC-U-018-02, AC-U-029〜031: 認可結果ログ, denied_sources 記録

#### 3.5.4 Supabase RLS & Policy
- [ ] `acl_*` テーブルの RLS ポリシー作成 (AC-DB-001〜005)
- [ ] `organizations`, `works`, `nations` など既存テーブルへの RLS 拡張 (コンテキスト一致テスト)
- [ ] JWT claims マッピング用 Edge Function / SQL ファンクション実装
- [ ] `tests/access-control/rls/*.spec.ts` で AC-I-009 を含む統合テストを RED→GREEN

#### 3.5.5 モニタリング & RBAC マトリクス管理
- [ ] RBAC マトリクス UI/API の最小実装 (`/admin/rbac-matrix`)
- [ ] `rbac_capabilities` / `rbac_matrix_snapshots` マイグレーション & テスト
- [ ] AC-B-002/003, AC-P-001〜003, AC-S-001〜004: バッチ・性能・セキュリティテスト整備
- [ ] 月次棚卸しスナップショット生成 & レポート出力 TDD

### Phase 4: 組織 (Organization) 管理
要件定義書 2.1.8 および RBAC要件に基づき実装。
- [ ] **組織管理機能**
    - [ ] 組織作成 (自動的に作成者が Leader ロール付与)
    - [ ] 組織詳細設定 (Leader権限必須)
    - [ ] メンバー管理 (招待, 承認, 追放) - RBACチェック組み込み
- [ ] **マッチング機能** (要件定義書 2.1.6)
    - [ ] 自動マッチングロジック (Batch/Trigger)
    - [ ] 手動マッチング・検索 UI

### Phase 5: 国 (Nation) 管理
要件定義書 2.1.9 および RBAC要件に基づき実装。
- [ ] **建国機能**
    - [ ] 国作成フロー (ポイント消費, 建国者への元首ロール付与)
    - [ ] ルール (憲法/法律) 設定
- [ ] **国への参加・運営**
    - [ ] 入国 (一時参加) / 常駐 (定住) フロー
    - [ ] 役職任命 (元首による閣僚任命など)
    - [ ] ポイント徴収・維持費管理 (国庫)

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
