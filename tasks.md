# MVP タスク一覧（優先順位・分割）

更新日: 2025-12-04

以下は MVP 実装のタスク群です。各タスクは TDD サイクルで進行します。

---

## 📊 現状サマリー

### 完了済み（✅）
- **認証基盤**: Supabase OAuth (Google) 実装済み、middleware.ts 設定完了
- **プロフィール**: 表示/編集 UI、CRUD API、profileLinks テーブル（外部SNS連携）完了
- **コミュニティ**: 組織作成/一覧 CRUD API、organizationMembers ロール管理完了
- **ポイント経済**: 履歴取得、トランザクション追加、残高バリデーション、ledgerEntries（二重記帳）実装済み
- **RBAC基盤**: acl_* スキーマ、computeMergedPermissions ロジック、resource-scoped exception 対応
- **管理者UI**: スケルトン作成完了（dashboard/users/contents/penalties/system）
- **HONO API**: REST API全エンドポイント実装済み（/api/v1/*）
- **UIコンポーネント**: 90以上のページ実装済み、全テストファイルパス
- **管理者ロールチェック**: middleware + Server Component 二重チェック実装完了 (*開発効率のため一時無効化中*)
- **公開組織ページ**: `/group/[groupCode]` 実装完了
- **リスト機能**: lists/list_items テーブル追加、listService 実装完了
- **URL設計書対応（Task 6.1）**: 全サブタスク完了
- **公開プロフィール（Task 6.2）**: `/user-profiles/[id]`, `/root-accounts/[id]` 実装完了
- **作品評価UI（Task 7.2-7.3）**: WorkRating、WorkActions、updateWorkReaction Server Action 完了
- **マッチング強化（Task 8.1-8.3）**: 価値観スコア、自動候補保存、条件検索UI完了
- **国機能（Task 9.1-9.3）**: 建国、徴収、常駐管理、調停者委任、銀行システム完了
- **シードデータ（Task 10.3）**: master.ts、dummy.ts、runner.ts 完了
- **ログ・監査（Task 11.2）**: 構造化ロガー、監査ログ、パフォーマンス計測完了
- **エラーハンドリング（Task 11.3）**: AppError階層、formatErrorResponse完了
- **チュートリアル（Task 12.1）**: TutorialStatus、TUTORIAL_STEPS、KingDialog、機能解放判定完了
- **Lv制UIへの統合（Task 12.4）**: MENU_UNLOCK_CONFIG、サイドバー2段階解放UI、🆕バッジ表示完了

### テスト状況
- **Test Files**: 179 passed | 11 skipped (190)
- **Tests**: 816 passed

### 要件定義書との適合状況（2025-12-04 更新）
| 機能カテゴリ | 状況 | 備考 |
|-------------|------|------|
| 認証（2.1.1） | ✅ 完全実装 | Google OAuth、セッション管理 |
| ルートアカウント/プロフィール（2.1.2-2.1.3） | ✅ 完全実装 | 複数プロフィール、外部連携 |
| 作品登録・評価（2.1.4-2.1.5） | ✅ 完全実装 | status、tier、claps、liked |
| マッチング（2.1.6） | ✅ 完全実装 | 自動・手動マッチング |
| 組織（ボトムアップ） | ✅ 完全実装 | CRUD、メンバー管理 |
| 国（トップダウン） | ✅ 完全実装 | topdownNations、銀行、マーケット |
| ポイントシステム（2.1.7） | ✅ 完全実装 | 二重記帳、自動回復 |
| ペナルティ | ✅ 実装済み | penalties テーブル |
| RBAC | ✅ 完全実装 | acl_* スキーマ |
| ゲーミフィケーション（2.1.7.1-2.1.7.2） | ✅ 完全実装 | Lv制、メニュー段階的解放UI、🆕バッジ |
| 手動マッチング詳細UI | ⚠️ 部分実装 | 案件管理UI未実装（フェーズ6で対応） |

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
- [x] Task 6.1: 未実装の主要ルートを段階的に追加
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
- [x] Task 9.1: 建国とポイント徴収フロー
  - [x] Task 9.1.1: 維持費計算ロジック（calculateMonthlyMaintenanceFee）実装
  - [x] Task 9.1.2: 常駐料金計算ロジック（calculateResidencyFee）実装
  - [x] Task 9.1.3: 徴収結果判定ロジック（calculateFeeCollectionResult, determineNationStatusAfterCollection）実装
  - [x] Task 9.1.4: collectMonthlyMaintenanceFee Server Action 実装
  - [x] Task 9.1.5: collectResidencyFee Server Action 実装
  - [x] Task 9.1.6: gracePeriodStartDate マイグレーション作成
- [x] Task 9.2: 常駐管理と国規模レベル判定
  - [x] Task 9.2.1: updateNationScaleLevel Server Action 実装
  - [x] Task 9.2.2: joinNation Server Action 実装
  - [x] Task 9.2.3: leaveNation Server Action 実装
- [x] Task 9.3: 国ルール設定と調停者委任
  - [x] Task 9.3.1: shouldRotateMediator, getNextMediator ロジック実装
  - [x] Task 9.3.2: appointMediator Server Action 実装
  - [x] Task 9.3.3: rotateMediators Server Action 実装
  - [x] Task 9.3.4: getMediators Server Action 実装
  - [x] Task 9.3.5: dismissMediator Server Action 実装

---

## フェーズ 5 — 非機能・横断テーマ

### 10. データ整合性とテスト
- [x] Task 10.3: シードデータ整備スクリプト作成
  - [x] Task 10.3.1: `src/db/seeds/master.ts` マスターデータシード実装
  - [x] Task 10.3.2: `src/db/seeds/dummy.ts` ダミーデータシード実装
  - [x] Task 10.3.3: `src/db/seeds/runner.ts` シード実行オーケストレータ実装
  - [x] Task 10.3.4: `src/db/seeds/index.ts` モジュールエクスポート
  - [x] Task 10.3.5: `src/db/seeds/seeds.test.ts` ユニットテスト

### 11. パフォーマンスと運用
- [x] Task 11.2: ログ・監査出力の整備
  - [x] Task 11.2.1: `src/lib/logger/logger.ts` 構造化ロガー実装
  - [x] Task 11.2.2: LogLevel（DEBUG/INFO/WARN/ERROR）サポート
  - [x] Task 11.2.3: audit() 監査ログメソッド実装
  - [x] Task 11.2.4: time() パフォーマンス計測メソッド実装
  - [x] Task 11.2.5: child() 子ロガーコンテキスト継承
  - [x] Task 11.2.6: `src/lib/logger/logger.test.ts` ユニットテスト
- [x] Task 11.3: エラーハンドリングの統一
  - [x] Task 11.3.1: `src/lib/errors/errors.ts` 基盤エラークラス実装
  - [x] Task 11.3.2: AppError 基底クラス（code, name, message, details）
  - [x] Task 11.3.3: ValidationError (400), UnauthorizedError (401), ForbiddenError (403)
  - [x] Task 11.3.4: NotFoundError (404), ConflictError (409), InternalError (500)
  - [x] Task 11.3.5: isAppError, toAppError, formatErrorResponse ユーティリティ
  - [x] Task 11.3.6: `src/lib/errors/errors.test.ts` ユニットテスト（15テストケース）

### 12. UI/UX 改善
- [x] Task 12.1: チュートリアル導線の実装
  - [x] Task 12.1.1: `src/lib/tutorial/tutorial.ts` チュートリアルロジック実装
  - [x] Task 12.1.2: TutorialStatus/TutorialRoute 定数定義
  - [x] Task 12.1.3: TUTORIAL_STEPS チュートリアルステップ定義
  - [x] Task 12.1.4: getTutorialProgress/canSkipTutorial/getNextStep 関数
  - [x] Task 12.1.5: isFeatureUnlocked/shouldShowTutorialPrompt 機能解放判定
  - [x] Task 12.1.6: `src/components/tutorial/KingDialog` 王様ダイアログUI
  - [x] Task 12.1.7: `src/components/tutorial/TutorialPrompt` チュートリアル導線バナー
  - [x] Task 12.1.8: `/tutorial/route-selection` ルート選択ページ
  - [x] Task 12.1.9: `src/lib/tutorial/tutorial.test.ts` ユニットテスト（38テストケース）
- [ ] Task 12.2: レスポンシブ対応の強化
  - [ ] Task 12.2.1: モバイルナビゲーション改善（ハンバーガーメニュー）
  - [ ] Task 12.2.2: テーブル表示のモバイル最適化
  - [ ] Task 12.2.3: フォーム入力のタッチ最適化
- [ ] Task 12.3: 検索機能の改善
  - [ ] Task 12.3.1: 全文検索インデックス追加
  - [ ] Task 12.3.2: 検索結果のハイライト表示
  - [ ] Task 12.3.3: 検索フィルタUI改善
- [x] Task 12.4: Lv制UIへの統合
  - [x] Task 12.4.1: サイドバーメニューへのLv連動解放表示
  - [x] Task 12.4.2: グレーアウト+Tips表示実装
  - [x] Task 12.4.3: 🆕バッジ表示（機能解放時）

---

## フェーズ 6 — 高度なUI機能（新規）

### 13. 手動マッチング詳細UI（UI設計書 0054-02 対応）
- [ ] Task 13.1: 案件管理UI
  - [ ] Task 13.1.1: CaseOverviewCard コンポーネント
  - [ ] Task 13.1.2: 案件一覧ページ（フィルタ、ソート）
  - [ ] Task 13.1.3: 案件詳細ページ（タブ構成）
- [ ] Task 13.2: 候補者選定UI
  - [ ] Task 13.2.1: CandidateSelector モーダル
  - [ ] Task 13.2.2: 適合度メータ表示
- [ ] Task 13.3: 提案・合意管理UI
  - [ ] Task 13.3.1: ProposalComposeSheet コンポーネント
  - [ ] Task 13.3.2: AgreementStatusPanel コンポーネント
- [ ] Task 13.4: 監査ログUI
  - [ ] Task 13.4.1: AuditLogDrawer コンポーネント
  - [ ] Task 13.4.2: ログフィルタリング機能

### 14. マップシステム（将来）
- [ ] Task 14.1: 2Dグリッドマップ表示
- [ ] Task 14.2: 国の位置管理

---

## 🎯 次のアクション（推奨順）

1. **Task 12.2**: レスポンシブ対応の強化（モバイルナビゲーション、テーブル最適化）
2. **Task 12.3**: 検索機能の改善（全文検索インデックス、ハイライト）
3. **Task 13.1-13.4**: 手動マッチング詳細UI（UI設計書 0054-02対応）
4. **Task 14**: マップシステム（将来拡張）

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

