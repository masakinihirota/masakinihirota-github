# Route naming - 検出結果と段階的リファクタ計画

作成日: 2025-11-28

このファイルは `scripts/check-route-naming.js` の実行結果 (reports/route-naming-report.json) をもとに、`src/app/(順序-機能名)` 命名規約に従って段階的にリファクタリングを行うための手順をまとめたものです。

## 🔎 検出ハイライト
- 検出対象 (violation の一部):
  - `src/app/(protected)/achievements` → 推奨: `(10-achievements)`
  - `src/app/(protected)/activity` → 推奨: `(10-activity)`
  - `src/app/(protected)/root_accounts` → 推奨: `(10-root-accounts)`（重複: `root-accounts` と `root_accounts`）
  - `src/app/(public)/login` → 推奨: `(10-login)`
  - `src/app/api` → 推奨: `(10-api)` (注意: API フォルダはプロジェクトの慣習により例外化する場合あり)
  - `src/app/protected` (括弧ありの `(protected)` と重複)

- 重複 (normalized) の例:
  - `protected`: `src/app/(protected)` と `src/app/protected` → canonical: `src/app/(protected)`
  - `root-accounts`: `src/app/(protected)/root-accounts` と `src/app/(protected)/root_accounts` → canonical: `src/app/(protected)/root-accounts`

詳細は `reports/route-naming-report.json` を参照してください。

## 🎯 方針（原則）
1. ルート階層 (機能単位) は可読性のため `(<order>-<kebab-name>)` 形式に統一する。
2. `(protected)` や `(public)` のようなグループ括弧は許容するが、その直下に来る機能名は `(<order>-<kebab-name>)` にする。
3. 深い階層（番号付き機能の内部）は通常の名前（`home` など）で良い。
4. 重複（`root_accounts` vs `root-accounts`）は `kebab-case` を採用して統一する。

## ✅ 安全な段階的リファクタ手順 (推奨順)

各段階は小さく、必ず Git ブランチを切って単一責務のコミットで実行してください。

### フェーズ A — 復旧と自動検出の確認（0.1日）
1. 現在の dev ブランチを保存 (commit 状態をクリーンにする)
2. ブランチ作成: `git checkout -b chore/route-naming-detection`
3. 確認: `pnpm run check:route-naming` → `reports/route-naming-report.json` を確認

### フェーズ B — 重複解消（最小インパクト、推奨順: high）
目的: 重複するディレクトリを統合して混乱を防ぐ

1. `protected` の重複を解消 (完了)
  - Move/copy contents of `src/app/protected` into `src/app/(protected)` (or vice-versa—canonical is `(protected)`)
  - コマンド例 (PowerShell):
     ```pwsh
     git checkout -b fix/routes/merge-protected
     git mv src/app/protected/* src/app/(protected)/ || (move-item -Path src/app/protected/* -Destination src/app/(protected) -Force)
     git commit -m "merge: remove duplicate src/app/protected -> use src/app/(protected)"

   - 実行結果: 2025-11-28 に `src/app/protected/page.tsx` を `src/app/(protected)/protected/page.tsx` に移動し、重複を解消しました (branch: chore/merge-protected-into-parenthesized)。
     ```
   - テスト & lint の確認: `pnpm run lint && pnpm test`

2. `root_accounts` と `root-accounts` の統合 (完了)
   - canonical: `src/app/(protected)/root-accounts`
  - 実施: `root_accounts` 側の UI 実装は `root-accounts` を canonical とし、`root_accounts` の重複 (components/route.json) を削除しました。互換性のため、`next.config.ts` にリダイレクトを追加して `/root_accounts*` → `/root-accounts*` を保っています。
  - 次の小さなステップ: `root-accounts` を `(10-root-accounts)` の番号付きフォルダに移動しました — これで `(protected)` グループの命名規約に従います。
  - 実行結果: 2025-11-28 に `src/app/(protected)/(menu)/(10-root-accounts)/root_accounts` を削除し、`src/app/(protected)/root_accounts` (互換用リダイレクト) を削除・`next.config.ts` に転送ルールを追加しました。routes manifest を再生成済み (25 エントリ)。

### フェーズ C — 機能ディレクトリの番号付き化（段階的適用）
目的: インパクトを分割し、作業が小さなコミット単位で安全にロールアウトできるようにする。

1. グループ単位で行う（例: `(protected)` の中のいくつかを一括で `10-..` 系にする）
   - 例: `achievements -> (10-achievements)`, `activity -> (11-activity)` など、間隔を空けて番号付け（10,20,30 など）しておくと将来の挿入が容易です。
   - 実施手順:
     - `git checkout -b feat/routes/protected-numbering`
     - `git mv src/app/(protected)/achievements src/app/(protected)/(10-achievements)`
     - Update imports (if any) and route references. Use the repo-wide search to find references.
     - Update/rename test files accordingly.
     - `pnpm run lint && pnpm test`
     - Commit and push.

2. `(public)` グループ内の修正も同様に行う。

### フェーズ D — API / 特別ケースの扱い
- `src/app/api` の扱いはプロジェクト方針による（API エンドポイントを App Router に置くか、別レイアウトにするか）。
- まずは发现を保留し、コアの UI ルート命名を整理した後で API が問題になるか検討する。

### フェーズ E — 検証・リグレッション防止
1. 各 PR の最後に `pnpm run check:route-naming` を実行し、違反が新規に出ていないことを確認。
2. 影響範囲のテスト（UI テスト、E2E、ユニット）を実行する。
3. 必要に応じて Next.js の rewrite/redirects ルールを追加して古いパスからの互換性を保つ。

## ⚙️ 自動化の提案
- `scripts/check-route-naming.js` を CI の一部として導入（ただし DB 統合テストはローカル実行の方針なので注意）
- 将来的には `scripts/plan-route-refactor.js` を作り、`route-naming-report.json` をもとに `git mv` コマンドのドラフトを生成することができます（ただし自動実行は慎重に）。

## 次のアクション提案（私に任せる場合）
1. まず「重複統合 (protected, root_accounts 等)」から着手して欲しいです。私はその変更を小さなコミットで作成し、テストと lint を通す PR を作れます。 (推定: 1〜2時間)
2. 次に `(protected)` グループの番号付けを 1 〜 2 機能ずつ段階的に実行します（各ステップごとにテストと lint を実行）。

---
このレポートは自動生成されたサマリです。不明点や命名規則の厳密ルール（例えば数値の振り方・幅など）があれば教えてください。私が次のコミットを作ります。
