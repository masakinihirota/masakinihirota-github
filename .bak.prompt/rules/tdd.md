---
trigger: always_on

# TDDルール (Next.jsコンポーネント開発向け)
この文書は、Next.js（App Router）を用いたコンポーネント／Server Action／ロジックの開発において、TDD (RED → GREEN → REFACTOR) を確実に実行するための実践ルールです。単独開発でもチーム開発でも一貫して品質と速度を両立できる運用を目的とします。

---

## 1. 目的と適用範囲
- 目的：テスト先行で仕様を確立し、品質を保ちながら機能を速く、安全に作ること。
- 適用範囲：Next.js App Router を用いた UI コンポーネント、Server Actions（/src/actions 等）、ビジネスロジック（/src/lib）とそのテスト。DB 統合テストは条件付きで扱う。

## 2. 基本原則（短く）
1. まず失敗テストを書く（RED）。
2. 最小限の実装でテストを通す（GREEN）。
3. テストを保ったままリファクタ（REFACTOR）。
4. コードは小さく意味あるコミットに分ける（単独開発でもログ必須）。

## 3. Next.js に沿ったワークフロー（推奨）
1. 仕様を短く書く（目的・主要ケース・境界ケース）。
2. Server Action の失敗ケース（認可・バリデーション）を先に書く。
3. ロジック（payload 整形・バリデーション）をユニットで書く。
4. UI（フォーム・コンポーネント）の受入れテストを書く。
5. 実装を行いテストを GREEN に持っていく。
6. 統合テスト（必要なら DB を使う）を追加し検証する。
7. リファクタ・ドキュメント更新・コミット。

## 4. テストの種類と優先度
1. ユニットテスト（ビジネスロジック） — 早く書けて速く回る。
2. Server Action（API層）テスト — 認可、バリデーション、副作用の仕様化を優先。
3. コンポーネント(UI) テスト — @testing-library/react / user-event を利用し、ユーザー視点で書く。
4. 統合/DB テスト — 実環境寄り。時間を要するため CI は条件分岐。

## 5. ファイル配置・命名規約（コロケーション）
- 機能毎にコードとテストを近接配置する（コロケーション）。
- 命名例:
	- UI コンポーネント: `Component.tsx` / `Component.test.tsx`
	- ロジック: `foo.logic.ts` / `foo.logic.test.ts`
	- Server Action: `createProfile.fetch.ts` / `createProfile.fetch.test.ts`
	- 統合テスト: `foo.integration.test.ts`
- テストは機能フォルダ同階層に置く（視認性と保守性向上）。

## 6. エラー形の標準（推奨）
全 Server Action は統一されたエラー形を返すこと：
- ValidationError: { code: 400, name: "ValidationError", message: string, details?: Record<string,string> }
- UnauthorizedError: { code: 401, name: "UnauthorizedError", message: string }
- NotFoundError: { code: 404, name: "NotFoundError", message: string }
- ServerError: { code: 500, name: "ServerError", message: string }
テストでは `code` と `name` を主にアサートする。

## 7. 認証・外部依存のモック方針
- Server Action のテスト：Supabase 等外部は stub またはインジェクションモックで置き換え。
- UI テスト：認証された状態 / 未認証状態を切替えたケースを用意。
- DB 統合は `RUN_DB_TESTS`（環境変数）で切替える。開発方針は **ローカルSupabase（Docker）での完結**を標準とし、CI 上での自動 DB 統合テスト実行は行わない方針です。

## 8. DB 統合テストの運用
- `RUN_DB_TESTS=1` が設定されたときのみ統合テストを有効化すること。CI 上での DB 自動実行は行いません。統合テストはローカルで行うことを標準とします。
- テスト DB はテスト実行ごとにクリア/マイグレーションし、ステートを汚さないこと。

## 9. ローカル & CI コマンド
- 単発テスト:
	pnpm test
- ウォッチ:
	pnpm test:watch
- DB 統合を含める（PowerShell 例）:
	$env:RUN_DB_TESTS = 1; pnpm test

## 10. サンプル：最初に書くべき RED ケース
例: `createProfile.fetch.test.ts`
- case #1: name が空 → ValidationError(code=400) を期待する
- case #2: 認証無し → UnauthorizedError(code=401) を期待する
例: `createProfile.logic.test.ts`
- payload 正規化・必須フィールドチェック（空・長さ・型）
例: `CreateProfileForm.test.tsx`
- 空 name では submit が無効化／エラーメッセージが表示される

## 11. 単独開発者向け簡易チェックリスト
- 失敗テスト（RED）→ 実装で GREEN → リファクタの流れをコミット履歴で確認する。
- 重要な仕様変更はテスト／ドキュメントも同時に更新。
- テストはローカルで通ることを最優先としてください。CI に依存しない開発を行うため、CI 上で DB 統合テストが必須となる状態は作りません。

## 12. 運用・メンテナンス
- ルールは実運用中に改善していく。問題はこのファイルにログする。
- 既存のテストスタイルがある場合は段階的に移行し、混在する場合は優先度を決める。

