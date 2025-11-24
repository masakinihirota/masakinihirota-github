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
