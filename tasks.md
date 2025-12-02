# MVP タスク一覧（優先順位・分割）

更新日: 2025-12-05

以下は MVP 実装のタスク群です。各タスクは TDD サイクルで進行します。

---

## 📊 現状サマリー

### 完了済み（✅）
- **認証基盤**: Supabase OAuth (Google) 実装済み、middleware.ts 設定完了
- **プロフィール**: 表示/編集 UI、CRUD API、テスト完了
- **コミュニティ**: 組織作成/一覧 CRUD API、テスト完了
- **ポイント経済**: 履歴取得、トランザクション追加、残高バリデーション実装済み
- **RBAC基盤**: acl_* スキーマ、computeMergedPermissions ロジック、resource-scoped exception 対応
- **管理者UI**: スケルトン作成完了（dashboard/users/contents/penalties/system）
- **HONO API**: REST API全エンドポイント実装済み（/api/v1/*）
- **UIコンポーネント**: 90以上のページ実装済み、テストファイルすべてパス
- **管理者ロールチェック**: middleware + Server Component 二重チェック実装完了
- **公開組織ページ**: `/group/[groupCode]` 実装完了
- **リスト機能**: lists/list_items テーブル追加、listService 実装完了
- **URL設計書対応（Task 6.1）**: nations/create, matching/list, report ページ実装完了
- **公開プロフィール（Task 6.2）**: `/user-profiles/[id]`, `/root-accounts/[id]` 実装完了
- **作品評価UI（Task 7.2-7.3）**: WorkRating、WorkActions 実装完了、updateWorkReaction Server Action 実装完了
- **マッチング強化（Task 8.1-8.3）**: 価値観・ティア評価ベースのスコア計算、自動マッチング候補保存、手動マッチング条件検索UI実装完了

### テスト状況
- **Test Files**: 170 passed | 11 skipped (181)
- **Tests**: 573 passed

---

## フェーズ 1 — コア MVP（完了） ✅

### 1. 認証（必須）
- [x] Task 1.1: OAuth認証フロー実装
- [x] Task 1.2: middleware.ts でセッション管理
- [x] Task 1.3: ログイン/ログアウト UI

### 2. プロフィール (高優先)
- [x] Task 2.1: プロフィール表示・編集の受け入れ基準を決める
- [x] Task 2.2: コンポーネント単位のユニットテストを書く（profile view/edit）
- [x] Task 2.3: 最小実装: DB スキーマ（Drizzle）と API/ルート

### 3. コミュニティ作成・一覧表示 (高)
- [x] Task 3.1: コミュニティ作成フローの acceptance criteria 作成
- [x] Task 3.2: コンポーネントテスト (フォーム検証 / 作成成功失敗) を作る
- [x] Task 3.3: 実装（小さな CRUD API + DB スキーマ）

---

## フェーズ 2 — ポイント経済（完了） ✅

- [x] Task 4.1: ポイント履歴表示の受け入れ基準
- [x] Task 4.2: トランザクション表現と DB 制約（Drizzle migration）を設計
- [x] Task 4.3: 最小限の支払い／付与フローのユニットテスト

---

## フェーズ 3 — 管理者機能等（一部完了）

### 5. RBAC・管理者機能
- [x] Task 5.1: RBAC の段階的導入プラン
  - [x] Task 5.1.1: resource-scoped exception の扱いを修正
- [x] Task 5.2: 管理 UI のスケルトン作成
- [x] **Task 5.3: 管理者ロールチェックを middleware に実装**
  - [x] Task 5.3.1: `/admin` 配下へのアクセス時に RBAC ベースの権限検証を行う
  - [x] Task 5.3.2: 管理者でないユーザーは `/home` へリダイレクト
  - [x] Task 5.3.3: userSystemRoles テーブルを活用した権限判定ロジック
  - [x] Task 5.3.4: Server Component での二重チェック（middleware + ページ内）
    - *Note: 開発効率のため `src/app/(admin)/layout.tsx` で一時的に無効化中*

---

## フェーズ 4 — 機能拡張（新規）

### 6. URL 設計書対応
- [ ] Task 6.1: 未実装の主要ルートを段階的に追加
  - [x] Task 6.1.1: `/group/[groupCode]` 公開組織ページの実装
  - [x] Task 6.1.2: `/lists` 関連ページの実装（スキーマ追加、listService実装）
  - [x] Task 6.1.3: `/nations/create` 建国申請フォームの実装
  - [x] Task 6.1.4: `/matching/list` 手動マッチング比較ページの実装
  - [x] Task 6.1.5: `/report` ペナルティ報告フォームの実装
- [x] Task 6.2: 公開プロフィールページの実装
  - [x] Task 6.2.1: `/public/user-profiles/[userProfileId]` 公開プロフィール
  - [x] Task 6.2.2: `/root-accounts/[rootAccountId]` 公開ルートアカウント

### 7. 作品カタログと評価
- [x] Task 7.2: 時制（今/人生/未来）+ティア評価 UI
- [x] Task 7.3: スキ/拍手（ポイント消費）と履歴記録
  - [x] Task 7.3.1: WorkActions UI コンポーネント（Like/Clap ボタン）
  - [x] Task 7.3.2: updateWorkReaction Server Action（ポイント消費・履歴記録）

### 8. マッチング機能強化
- [x] Task 8.1: 価値観・ティア評価ベースのスコア計算 RPC/View
  - [x] Task 8.1.1: computeValueMatchScore ロジック実装
  - [x] Task 8.1.2: computeEnhancedMatchScore（作品+価値観結合スコア）実装
  - [x] Task 8.1.3: computeEnhancedMatches Server Action 実装
- [x] Task 8.2: 自動マッチング候補保存
  - [x] Task 8.2.1: matching_sessions / matching_scores スキーマ追加
  - [x] Task 8.2.2: saveMatchingSession Server Action 実装
- [x] Task 8.3: 手動マッチングの条件検索 UI
  - [x] Task 8.3.1: MatchingSearch コンポーネント実装（キーワード検索、フィルタ、ソート）
  - [x] Task 8.3.2: MatchingSearchFilters インターフェース定義

### 9. 国機能（トップダウン）
- [ ] Task 9.1: 建国とポイント徴収フロー
- [ ] Task 9.2: 常駐管理と国規模レベル判定
- [ ] Task 9.3: 国ルール設定と調停者委任

---

## フェーズ 5 — 非機能・横断テーマ

### 10. データ整合性とテスト
- [ ] Task 10.3: シードデータ整備スクリプト作成

### 11. パフォーマンスと運用
- [ ] Task 11.2: ログ・監査出力の整備
- [ ] Task 11.3: エラーハンドリングの統一

### 12. UI/UX 改善
- [ ] Task 12.1: チュートリアル導線の実装
- [ ] Task 12.2: レスポンシブ対応の強化
- [ ] Task 12.3: 検索機能の改善

---

## 🎯 次のアクション（推奨順）

1. **Task 9.1-9.3**: 国機能（トップダウン）の実装
2. **Task 10.1**: RLS ポリシー本番適用
3. **Task 12.1**: チュートリアル導線の実装

---

## TDD 連続実行ガイド — リストが完了するまで厳密に回す (必読)

このリポジトリでは、以下のルールにしたがって各タスクを **TDD（RED→GREEN→REFACTOR）で順番に完了** していきます。

### 最重要ルール（必須）
- 1 サイクルにつき **必ず 1 個だけ失敗するテスト（RED）を追加** してください
- RED → 実装（GREEN）→ リファクタ（REFACTOR）の順を厳守

### 実行フロー（手順）
1. 未完了の **最上位のタスク** を選ぶ
2. 最小の失敗テストを 1 件だけ追加する
3. テストを実行し、追加したテストが **確実に失敗すること** を確認（RED）
4. 最小の実装を行ってテストをパスさせる（GREEN）
5. リファクタリングしてテストが全て通ることを確認（REFACTOR）
6. タスクにチェックを入れ、コミット
7. 次の未完了タスクへ移り、同じサイクルを繰り返す

### コミットルール
- 完了コミット: `TDD: complete <TaskIdentifier> — <short-description>`
- タスク完了時は tasks.md にチェックを入れ、同コミットに含める

