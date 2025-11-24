# ウォークスルー (Walkthrough)

## 実施した変更

1.  **スキーマの修正 (`src/db/schema.ts`)**
    - `rootAccounts` テーブルの `userId` カラムに `.unique()` 制約を追加しました。
    - これにより、`users` と `rootAccounts` の 1:1 関係がデータベースレベルで保証されます。

2.  **マイグレーションの生成 (`drizzle/0002_lovely_maria_hill.sql`)**
    - `npm run db:generate` を実行し、ユニークインデックスを追加するマイグレーションファイルを生成しました。

## Supabase 設定について

ご報告いただいた Supabase のキー変更について、以下の対応をお願いします。

`src/lib/supabase/client.ts` は環境変数 `NEXT_PUBLIC_SUPABASE_ANON_KEY` を参照しています。
`supabase status` で表示された新しいキーを `.env` (または `.env.local`) ファイルに反映させてください。

**`.env` ファイルの更新例:**

```env
# 既存の URL (変更がない場合)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# 新しいキーに更新
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

# 必要であればサービスロールキーも更新 (サーバーサイドで使用する場合)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

※ `sb_publishable_...` 形式のキーは、Supabase の新しいローカル開発環境や特定の構成で見られる形式ですが、役割としては従来の `ANON_KEY` と同じです。

## 次のステップ
- `.env` ファイルを更新し、アプリケーションを再起動して接続を確認してください。
