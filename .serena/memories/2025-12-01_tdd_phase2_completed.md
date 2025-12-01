# TDD 作業ログ — フェーズ 2 完了 (2025-12-01)

## 完了タスク
- **Task 4.1**: ポイント履歴表示の受け入れ基準 ✅
- **Task 4.2**: トランザクション表現と DB 制約 ✅
- **Task 4.3**: 最小限の支払い／付与フローのユニットテスト ✅

## 変更ファイル一覧
1. `src/lib/points/getPointHistory.service.ts` - ポイント履歴取得サービス
2. `src/lib/points/getPointHistory.service.test.ts` - ポイント履歴取得テスト
3. `src/lib/points/addPointTransaction.service.ts` - ポイントトランザクション追加サービス
4. `src/lib/points/addPointTransaction.service.test.ts` - 残高非負制約テスト

## TDD サイクル実行ログ

### サイクル 1: getPointHistory サービス
- **RED**: `expected false to be true` (スタブが `success: false` を返却)
- **GREEN**: DB 選択実装後、テストパス
- **REFACTOR**: Lint OK

### サイクル 2: addPointTransaction サービス（残高非負制約）
- **RED**: `expected 'Not implemented' to contain '残高不足'`
- **GREEN**: 残高チェックロジック実装後、テストパス
- **REFACTOR**: 全テストパス (2 tests)

## 実装内容の要約
- ポイント履歴取得 (`getPointHistory`) - rootAccountId に紐づくトランザクション履歴を取得
- ポイントトランザクション追加 (`addPointTransaction`) - 残高不足時はエラーを返す非負制約付き

## 次のアクション
- フェーズ 3 (Task 5.2): 管理 UI のスケルトン作成
