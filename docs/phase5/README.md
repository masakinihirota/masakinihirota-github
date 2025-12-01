# Phase 5 — Nation (国) 管理 (ドキュメント)

このファイルは Phase 5 (国管理) の開発ガイドと実装ポリシーをまとめた README です。
このプロジェクトは TDD を厳格に守る流儀で進められます — ここでは Phase 5 に関する特記事項と、テスト／動作確認方法をまとめます。

---

## 目的
- Phase 5: 国 (Nation) 管理を安全かつ段階的に実装するための指針を示します。

## コア方針（必読）
- このリポジトリでは Phase 5 の変更は「TDD（RED→GREEN→REFACTOR）」サイクルで、かつ「1 変更につき失敗するテストは必ず 1 件のみ」を厳守します。
- すべての実装変更は Phase 5 関連コードと `implementation_plan.md` / `task.md` の対応箇所に限定してください（他の Phase への横やりは禁止）。

## Phase 5 の Scope（現在の進捗）
- 国作成フロー（createNation）
  - 国名バリデーション helper の追加
  - ポイント消費検証（canCreateNation）
  - point_transactions への課金ログ挿入
  - root_account_points の残高引き落とし
  - nations テーブルへの nation レコード作成
  - 建国者へ sovereign ロール付与
  - DB 操作はトランザクション（BEGIN/COMMIT/ROLLBACK）で保護

- 国参加（joinNation）
  - 招待が必要（invitation レコードが存在しなければ拒否）
  - 招待には有効期限があり、期限切れなら入国を拒否
  - 招待発行 (createInvitation) はデフォルトで有効期限 7 日を設定する（TTL 可変）
    - 招待発行は、発行時に招待トークンを生成して返す（未指定時は UUID v4 を自動発行）

（詳細は `implementation_plan.md` と `task.md` を参照）

## 開発ルール（短縮）
1. 作業を開始する前に `implementation_plan.md` / `task.md` を確認する
2. 最小の失敗テストを 1 件だけ追加（RED）
3. 失敗テストが破棄されることを確認 → 実装（GREEN）→ リファクタ（REFACTOR）→ テスト実行
4. DB 統合テストはローカル environment（Supabase ローカル）でのみ実行し、CI では自動実行しない

## テストとローカル実行
1. 依存をインストール: `pnpm install`
2. 単体テスト (vitest): `pnpm test <path/to/test>` または `pnpm test` で全テスト
3. DB 統合テスト (ローカル Supabase): 必要に応じて `RUN_DB_TESTS=1 pnpm test` を利用

---

## 参考: 直近で実装した小さな単位（例）
- `src/lib/nation/validate.ts` — 国名の最小検証（trim, min/max, 制御文字排除）
- `src/lib/nation/create.logic.ts` — canCreateNation (ポイント要件)
- `src/actions/createNation.fetch.ts` — 国作成 Server Action の最小実装（課金/残高更新/nation 作成/role 割当をトランザクション内で実行）
- `src/actions/joinNation.fetch.ts` — nation への参加 Server Action（招待必須・有効期限チェック）

---

質問や追加したいチェック項目があれば教えてください。Phase 5 の範囲であればこちらで小さな TDD サイクルを続行します。
