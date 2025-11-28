# タスクリスト

- [x] Phase 1: 環境構築と基盤
- [x] Phase 2: 認証とユーザー管理
- [/] Phase 3: ユーザープロフィール管理
    - [x] 構造修正: `/protected` の配置修正
    - [x] マスタデータ整備 (Works, Values)
    - [ ] ユーザープロフィール作成機能 (TDD)
        - [x] ページ: Create Profile のレンダリング（テスト修正済）
        - [x] サーバーアクション: createProfile に root アカウントあたりのプロファイル上限チェックを追加 (MAX_PROFILES_PER_ROOT=3) — `src/actions/createProfile.fetch.test.ts` / `src/actions/createProfile.fetch.ts`
        - [x] UI: CreateProfileForm のリンク入力処理を修正 (初期リンクの表示・複数追加・空ラベル省略のシリアライズ) — `src/components/profile/CreateProfileForm/CreateProfileForm.tsx` / `src/components/profile/CreateProfileForm/CreateProfileForm.test.tsx`
        - [ ] `acl_permissions` / `acl_roles` / `acl_role_permissions` マイグレーション RED→GREEN
        - [ ] `acl_groups` / `acl_group_closure` / `acl_group_role_assignments`
        - [ ] `acl_exception_grants` / `acl_nation_role_assignments` / `user_authorization_permissions`
        - [ ] 既存テーブル連携 (organization_members, topdown_nation_memberships, enums)
    - [ ] シードデータ & 初期ロール
        - [ ] 権限カタログ SQL (R1〜R7, 組織/国カテゴリ) TDD
        - [ ] 初期ロール定義 (system / organization / nation)
        - [ ] 役割紐付け & 開発用割当シード
```
# タスクリスト

- [x] Phase 1: 環境構築と基盤
- [x] Phase 2: 認証とユーザー管理
- [/] Phase 3: ユーザープロフィール管理
    - [x] 構造修正: `/protected` の配置修正
    - [x] マスタデータ整備 (Works, Values)
    - [ ] ユーザープロフィール作成機能 (TDD)
        - [x] ページ: Create Profile のレンダリング（テスト修正済）
        - [ ] `acl_permissions` / `acl_roles` / `acl_role_permissions` マイグレーション RED→GREEN
        - [ ] `acl_groups` / `acl_group_closure` / `acl_group_role_assignments`
        - [ ] `acl_exception_grants` / `acl_nation_role_assignments` / `user_authorization_permissions`
        - [ ] 既存テーブル連携 (organization_members, topdown_nation_memberships, enums)
    - [ ] シードデータ & 初期ロール
        - [ ] 権限カタログ SQL (R1〜R7, 組織/国カテゴリ) TDD
        - [ ] 初期ロール定義 (system / organization / nation)
        - [ ] 役割紐付け & 開発用割当シード
    - [ ] RBAC サービス実装 (Vitest)
        - [ ] AC-U-001〜005/016: 基本ロール合成 & 否定優先
        - [ ] AC-U-002/003/008/009: 論理ロール & コンテキスト
        - [ ] AC-U-006/007/019〜023: 例外承認ライフサイクル
        - [ ] AC-U-010〜015, AC-I-001〜004: キャッシュ・マテビュー
        - [ ] hasPermission/requirePermission & Ledger ガード (AC-I-005〜008, AC-U-024〜028)
        - [ ] 監査ログ (AC-U-018-02, AC-U-029〜031)
    - [ ] Supabase RLS & ポリシー
        - [ ] `acl_*` RLS AC-DB-001〜005
        - [x] Nation 招待発行: デフォルト有効期限(7日) + server-action test
        - [x] Nation 招待発行: トークン自動生成 (UUID v4) を返す + server-action test
- [x] UI Prototype (Playground)
    - [x] Home Page Demo
    - [x] Root Account Screen Demo
    - [x] User Profile Screen Demo
    - [x] Works List Screen Demo
    - [x] Work Detail Screen Demo
    - [x] Work Registration Screen Demo
    - [x] Organization List Screen Demo
    - [x] Nation List Screen Demo
    - [x] Matching Settings Screen Demo
    - [x] Search Screen Demo
    - [x] Settings Screen Demo
    - [x] Oasis Declaration Page Demo
    - [x] Terms of Service Page Demo
    - [x] Privacy Policy Page Demo
# Workflow Updates
    - [ ] Run integration tests locally and verify (REFACTOR)
    - [x] CI workflow: manual integration-db-tests.yml added
- [x] Review RSC Article and Update `nextjs-components.md`
```
