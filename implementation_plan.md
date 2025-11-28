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
    - [x] 外部SNSリンク追加・削除 UI
    - [x] 外部リンクの複数追加/削除 UI
    - [x] クライアント側 URL バリデーション
    - [x] URL バリデーション
    - [x] 保存ロジック (DB 永続化)
    - [x] DB マイグレーション: drizzle/0005_profile_links.sql
- [ ] **公開形式 / 表示切替**
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
    - [ ] [RED] `supabase/seed/05_acl_permissions.sql` の期待行数テスト (R1〜R7 スコープ別)
    - [ ] [GREEN] 権限コード実データ投入 (システム / 組織 / 国 / 監査 / Ledger)
    - [ ] [REFACTOR] コメント・カテゴリ整理
- [ ] **ロール初期値**
    - [ ] システムロール: R1 (Super Admin)〜R7 (一般ユーザー)
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
    - [x] 国作成 server action: ポイント検証 (unit + server action test)
    - [x] 建国時の課金（point_transactions登録） + server-action test
    - [x] 建国時の残高更新（root_account_points の引き落とし） + server-action test
    - [x] 建国者に元首（sovereign）ロールを付与 + server-action test
    - [x] 建国処理をトランザクション化（BEGIN/COMMIT/ROLLBACK） + server-action test
    - [x] Nation レコード作成（nations テーブルへの挿入） + server-action test
    - [x] 国作成時のポイント消費検証 (unit)
    - [ ] ルール (憲法/法律) 設定
    - [x] 国名バリデーション helper + unit test
    - [x] 国名最大長チェック (<=50) + unit test
    - [x] 国名に制御文字を含めない検証 + unit test
- [ ] **国への参加・運営**
    - [ ] 入国 (一時参加) / 常駐 (定住) フロー
    - [x] Nation 参加: 招待必須の検証 + server-action test
    - [x] Nation 入国: 招待トークン有効期限チェック + server-action test
    - [x] Nation 招待発行: デフォルト有効期限(7日) + server-action test
    - [x] Nation 招待発行: トークン自動生成 (UUID v4) を返す + server-action test
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
    - [x] 最小限のマッチングロジック (`computeMatchesForProfile`) を実装（pure logic + unit tests）
    - [x] サーバアクション (`computeMatches`) を追加し、integration test を用意
    - [x] CI で matching の integration test を実行するようにワークフローを更新

5. 検証とリリース準備
    - [x] 全テスト（unit/ui）と production build を実行し合格
    - [ ] ドキュメント整理とリリースノート作成（本タスク: 残り）

---

現状: 上記の MVP チェックリスト 1-4 は完了しました。次は最終ドキュメント整理／PR／リリースノート作成を進め、MVP を正式にまとめます。
