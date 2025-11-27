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
- [ ] **マスタデータ整備**
    - [ ] Works (作品) / Values (価値観) のシードデータ投入
- [ ] **ユーザープロフィール作成機能 (TDD)**
    - [ ] プロフィール基本情報入力 (千の仮面: 複数作成可)
    - [ ] 役割選択 (リーダー/メンバー)
    - [ ] 目的設定 (仕事, 遊び, 婚活等)
    - [ ] 種類選択 (本人/インタビュー/他者視点)
    - [ ] **組織自動作成処理** (リーダー選択時、自動的に1人組織を作成)
- [ ] **作品登録・評価機能** (要件定義書 2.1.4 - 2.1.5)
    - [ ] 作品検索・選択 UI
    - [ ] 評価入力 (Tier 1-3, 普通/合わない)
    - [ ] 状態入力 (今/人生/未来)

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
