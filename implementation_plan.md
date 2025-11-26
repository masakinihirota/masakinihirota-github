# VNS masakinihirota MVP 実装計画書

## 1. プロジェクト概要
**VNS (Value Network Service) masakinihirota** の MVP (Minimum Viable Product) を構築します。
本プロジェクトは、価値観に基づくコミュニティ形成（組織・国家）を支援するプラットフォームです。

## 2. 技術スタック (確定版)
*   **Frontend/Framework**: Next.js 15.5.2 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Database**: PostgreSQL (Supabase Local)
    *   *変更点*: Turso (SQLite) から変更
*   **ORM**: Drizzle ORM
*   **Auth**: Supabase Auth (Google OAuth)
*   **Testing**: Vitest + React Testing Library (TDD)
*   **Deployment**: Cloudflare Workers / Pages (予定)

## 3. 開発方針
*   **テスト駆動開発 (TDD)**:
    *   **RED**: 失敗するテストを書く
    *   **GREEN**: 最小限の実装でテストを通す
    *   **REFACTOR**: コードを改善する
*   **コロケーション (Co-location)**:
    *   機能ごとにディレクトリをまとめ、コンポーネント、ロジック、テストを近くに配置する。

## 4. 実装フェーズと進捗

### Phase 1: 環境構築と基盤 (完了)
- [x] Next.js 15.5.2 プロジェクト初期化
- [x] 開発依存関係のインストール (Vitest, Drizzle Kit 等)
- [x] データベース選定と設定 (Supabase Local / PostgreSQL)
- [x] Drizzle ORM 設定 (`drizzle.config.ts`, `src/lib/db.ts`)
- [x] 基本スキーマ定義 (`src/db/schema.ts`)
    - Users, RootAccounts, Profiles, Works, Values, Organizations, Nations

### Phase 2: 認証とユーザー管理 (現在進行中)
- [x] Supabase Auth クライアント/サーバー/ミドルウェア実装
- [x] **DBマイグレーション実行 (Postgresへのスキーマ適用)**
- [x] **Auth Trigger の適用 (`auth.users` -> `public.users` 同期)**
- [ ] **ログイン画面の実装 (Google Auth)**
- [x] **ルートアカウント (Root Account) 作成機能 (TDD)**
    - 初回ログイン後のオンボーディングフロー

### Phase 3: プロフィール管理
- [ ] Works (作品) / Values (価値観) マスタデータのシード投入
- [ ] ユーザープロフィール作成機能 (TDD)
    - 選択式 (Selection-only) での Works/Values 登録
    - 自由入力なし

### Phase 4: 組織 (Organization) 管理
- [ ] 組織作成機能 (TDD)
- [ ] メンバー招待・参加機能
- [ ] 組織内ロール管理

### Phase 5: 国家 (Nation) 管理
- [ ] 国家建国機能 (TDD)
- [ ] 組織の国家加盟フロー
- [ ] 国家レベル管理 (バッチ/マテリアライズドビュー想定)

## 5. 次のステップ (Next Actions)

1.  **DBマイグレーション**: Drizzle で生成したスキーマをローカルの Supabase DB に適用する。
2.  **Auth Trigger 適用**: `supabase/auth_trigger_manual.sql` を実行し、ユーザー同期を有効化する。
3.  **ルートアカウント実装**: TDD サイクルを回し、ログイン後のルートアカウント登録画面を作成する。
