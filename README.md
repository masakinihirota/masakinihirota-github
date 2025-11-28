This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## データベースのセットアップ (Supabase)

### ⚠️ 重要: 認証ユーザー同期トリガーについて
`auth.users` (Supabase Auth) にユーザーが作成された際、`public.users` (アプリケーションDB) へ自動的に同期するトリガーが必要です。
セキュリティ権限の都合上、このトリガーは Drizzle の自動マイグレーションには含まれていません。

#### 本番環境 / 新規環境構築時
**手動での適用が必要です。**
1. `drizzle/auth_trigger_manual.sql` の内容をコピーします。
2. Supabase Dashboard の **SQL Editor** を開きます。
3. SQLを貼り付けて実行してください。

#### ローカル開発環境
ローカル開発環境では、以下のコマンドを使用することで自動的にトリガーが適用されます。

```bash
npm run supabase:reset
```
※ このコマンドは `supabase db reset` を実行した後、自動的にトリガー適用スクリプト (`scripts/apply-auth-trigger.js`) を実行します。

### 利用可能なコマンド
`package.json` に以下のショートカットコマンドが登録されています。

| コマンド | 説明 |
| --- | --- |
| `npm run supabase:start` | ローカルSupabaseを起動 |
| `npm run supabase:stop` | ローカルSupabaseを停止 |
| `npm run supabase:status` | ステータス確認 (API URL等) |
| `npm run supabase:restart` | 再起動 |
| `npm run supabase:reset` | DBをリセットし、マイグレーション・シード・**Authトリガー**を再適用 |
| `npm run supabase:gen-types` | DBスキーマからTypeScript型定義を生成 (`src/types/supabase.ts`) |
| `pnpm compute:aggregates` | ワーク（作品）評価の集計を実行するバッチスクリプト（DB 必須） |

## 開発ルール（短いガイド）

以下はこのリポジトリで統一している重要な開発ルール／実務的な運用メモです。

### テストの実行方法（重要）
 `pnpm test` (または `npm run test`) はローカルでの単発実行を想定したコマンドです（このリポジトリではローカルSupabaseを使った開発が標準です）。

#### ローカル開発チェックリスト（必ず確認）
# NOTE: TypeScript/Drizzle seeding has been migrated to Supabase SQL and is deprecated.
# Use the canonical Supabase SQL seed runner:
pnpm run db:seed
```
開発はローカルSupabase（Docker）で完結する前提です。次の順でローカルの動作確認を行ってください。
	(deprecated — TypeScript/Drizzle seeds migrated to `supabase/seed/*.sql`. Original TypeScript/Drizzle seed sources were archived and have now been permanently removed.)

1) Supabase の起動とステータス確認

```pwsh
pnpm run supabase:start
pnpm run supabase:status
```

2) 環境変数 `DATABASE_URL` の確認（テスト/マイグレーション用）

```pwsh
# 例（ローカルSupabase）
$env:DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
```

3) マイグレーション・Auth トリガ・シードの適用（必要なら）

```pwsh
	pnpm run db:migrate
	node scripts/apply-auth-trigger.js   # 必要なら
	# Use the canonical Supabase SQL seed runner
	pnpm run db:seed
```

4) DB 統合テストを含めたテスト実行

```pwsh
$env:RUN_DB_TESTS = '1'
pnpm test
```

5) 簡易チェック（自動化）を実行する

```pwsh
pnpm run dev:verify
```

##### dev:verify — 使い方 (詳細)
`dev:verify` は PowerShell スクリプト `scripts/dev-verify.ps1` を呼び出し、ローカル開発環境 (Supabase Local) の簡易セルフチェックを行うための補助ツールです。危険な操作は行わず、以下の動作を行います。

- 環境に `pnpm` があるかを確認
- `pnpm run supabase:status` で Supabase の稼働状況を確認
- 環境変数 `DATABASE_URL` がセットされていれば簡易SQLで接続を検査

オプション引数:
- `-RunAll` — マイグレーション・Auth トリガ・シードの実行を行います（ローカル DB が整っていることが前提です）。
- `-RunTests` — `-RunAll` と併用すると DB 統合テストを含めてテストを実行します（内部で `RUN_DB_TESTS=1` を設定します）。

実行例 (PowerShell):

1) 簡易チェックだけ実行

```pwsh
pnpm run dev:verify
```

2) マイグレーションとシードまで実行

```pwsh
pwsh ./scripts/dev-verify.ps1 -RunAll
```

3) マイグレーションから DB 統合テストまでフルで実行

```pwsh
pwsh ./scripts/dev-verify.ps1 -RunAll -RunTests
```

注意: `dev:verify` はローカルSupabase を前提にした補助スクリプトです。実行前に `DATABASE_URL` やローカル Supabase のポート等が自分の環境と一致していることを確認してください。
- ファイルの変更を監視しながらテストを継続実行したい場合は `pnpm test:watch` を使ってください。
- DB 統合テストはデフォルトでスキップされます。開発ワークフローは **ローカルSupabase（Docker）での完結**を前提としており、CI で自動的に DB 統合テストを実行する設定はプロジェクト方針上廃止されています。DB 統合テストを実行するには、ローカル環境で明示的に環境変数を設定してください。

または DATABASE_URL を指す接続文字列を用意してからテストを実行します。CI に依存せずローカルで検証することで開発コストと時間を削減してください。
### 追加: テスト環境の詳細と DB テスト実行方法
理由: デフォルトのウォッチモードで止まってしまうと自動化やCIで想定外の状態になるため、`pnpm test` は単発実行にしてあります。なお、このプロジェクトのワークフローはローカル完結を標準とし、CI上でのDBテスト自動実行は行わない方針です。

- テストは Vitest を使用しています。グローバルな jest-dom マッチャは `vitest.setup.ts` で読み込まれるため、各テストファイルで `import "@testing-library/jest-dom"` を個別に書く必要はありません。
- DB 統合テストはデフォルトでスキップされます（ローカル / CI に Postgres が無い環境でもテストが失敗しないため）。DB 統合テストを実行するには、明示的に環境変数を設定してください。

	例: Windows PowerShell (一時的に環境変数をセットしてテストを実行)

```pwsh
$env:RUN_DB_TESTS='1'; pnpm test
```

または DATABASE_URL を指す接続文字列を用意してからテストを実行します。

例: 特定のテストだけを実行する

```pwsh
pnpm test -- -t CreateRootAccount
```

### バッチ処理 / CI の仕組み

このリポジトリには、作品評価の集計を行うバッチ実装と CI ワークフローが追加されています。

- バッチスクリプト: `scripts/compute-work-aggregates.js` — Postgres に接続して `profile_works` を集計し `work_aggregates` テーブルに upsert します。
- 実行方法: `pnpm compute:aggregates`（実行には DB への接続文字列 `DATABASE_URL` が必要です）
- CI: `.github/workflows/compute-aggregates.yml` — push / PR に対して Postgres サービスを起動し、マイグレーション → 統合テスト → バッチ実行の流れを自動で実行するワークフローを追加済みです。

## クライアント/サーバ境界のガイドライン（MVPルール）

このプロジェクトではクライアント側のバンドルにサーバ専用モジュール（例: `@/lib/db`, `drizzle-orm`, `postgres`, `@/db/schema` 等）が含まれないように徹底します。MVPとしてまずは以下を守ってください：

- クライアントコンポーネント（`"use client"` を含むファイル）はサーバ専用モジュールを import しない。
- クライアント側でサーバ処理が必要な場合は、Server Action を呼ぶのではなく、`/api/*` のサーバ API エンドポイント（`next/server` runtime）を経由して HTTP POST/GET で呼ぶ。
- コンポーネント内の `*.fetch.ts` は副作用をまとめる場所ですが、`use client` ファイルにはサーバ専用 import を置かないこと。

自動チェック:

- 既にスクリプト `scripts/check-client-imports.js` を追加しています。クライアント側ファイルに `use client` が含まれるファイル内で、上記の server-only module を import していないかを検出します。CIに組み込むことで、間違った import が PR で混入しにくくなります。

実行方法:

```bash
pnpm run check:client-imports
```

CI ルールの例: PR のビルド中にこのチェックを実行し、違反があればビルドを失敗させることを推奨します。


---

### 注記: フェッチ実装の統合

- `CreateRootAccount` のサーバーアクション（fetch）実装は一つのファイルに統合しました。
	- 新しい実装ファイル: `src/components/root-accounts/CreateRootAccount/CreateRootAccount.fetch.ts`（この中に `createRootAccountAction` が含まれます）
	- テストやコードベースは `CreateRootAccount.fetch` をインポートする形で参照できます（拡張子は不要です）。

---

理由: デフォルトのウォッチモードで止まってしまうと CI や自動化のワークフローで想定外の状態になるため、`pnpm test` は単発実行にしてあります。

### コンポーネントとデータフェッチの分離（コロケーション）
このプロジェクトでは、責務の分離とテスト容易性を高めるために以下の方針を採用しています。


## 変更履歴（最近の補正）

- 2025-11-28: `eslint.config.mjs` に `.next/**`, `dist/**`, `node_modules/**`, `.vercel/**` を ignores として追加しました。これにより自動生成物が ESLint の走査対象にならず、ノイズとなっていた多数のエラーが抑制されます。

次のステップ: ルート構成（`src/app/`）の命名規約の不整合を検出 → 段階的リファクタリング計画を作成します。
- フェッチ（データ取得）: 機能（feature）扱いとして各コンポーネント配下に `*.fetch.tsx` を置きます。副作用（API / DB 呼び出し）はここに集約します。
- ロジック（純粋処理）: データ変換や純粋ロジックは `*.logic.tsx` に収めて、単体テストが可能な形にします。
- エクスポート: コンポーネントは名前付きエクスポートを使用することを推奨します。ページ単位で `src/components/<route>/index.ts` に集約して `import * as route1 from '@/components/route1'` のように扱います。

例: `src/components/route1/ComponentA` の構成
```
ComponentA.tsx         # UI（表示）
ComponentA.logic.tsx   # 純粋ロジック
ComponentA.fetch.tsx   # データ取得（副作用）
ComponentA.test.tsx    # テスト
```

メリット: ルーティングは薄く保てるため可読性が向上し、機能ごとにフェッチとロジックを分離することでテスト・モック・再利用がしやすくなります。

---

