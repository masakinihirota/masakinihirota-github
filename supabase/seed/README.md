# Supabase seed files

This folder contains SQL seed files intended for running with the Supabase CLI or directly against a Postgres instance.

注: このプロジェクトのシードデータは日本語で記述されています（テスト用サンプル）。

Guidelines & rationale
- Keep seeds idempotent where possible (ON CONFLICT DO NOTHING / DO UPDATE) so repeated runs are safe in dev/staging.
- Avoid inserting real production user credentials. Use seeds primarily for dev/staging/testing.
- Prefer using `supabase db seed` or the Supabase SQL Editor for production-sensitive operations (manually review before applying).

Files (split by domain)
- `01_reference.sql` — reference/master data (work_categories, value_categories, organization_roles, nation_levels)
- `02_users_root_accounts.sql` — public.users (development convenience) and root_accounts
- `03_profiles.sql` — profiles fixtures
- `04_works.sql` — works (catalog)
- `05_profile_works.sql` — profile -> works ratings
- `06_points.sql` — root_account_points + point_transactions
- `07_achievements.sql` — achievements + root_account_achievements
- `08_skills.sql` — skills + profile_skills
- `09_relations.sql` — follows + match_history

注意事項
- カテゴリ ID: `work_categories` の `id` は内部キーです。アプリケーションやテストで利用しているIDは次のとおりです: `novel`, `manga`, `anime`, `movie`, `game`, `drama`, `book`, `music`, `other`。
	`04_works.sql` では `category_id` にこの内部キーを使う必要があります（表示名の日本語ではなくIDを指定してください）。
- 古いファイル `0001_initial_data.sql` は英語で書かれた旧式の一括シードで、現在は運用上の混乱を避けるためマスター `seed.sql` に含めていません。必要であれば手動で利用できますが、基本はドメイン分割済み (`01_...`〜`09_...`) のシードを使ってください。
- ほとんどのINSERTは `ON CONFLICT` が使われていますが、環境やユニーク制約変更によって動作が変わる可能性があるため、繰り返し実行する前に目視で確認してください。

Master entrypoint
- `../seed.sql` — includes and executes the above files in order. This is the default path used by `supabase/config.toml` in this project.

How to run

1) With Supabase CLI (recommended, runs SQL in a controlled environment):

```powershell
# ensure you're linked to the right supabase project
supabase link

# run migrations then execute the master seed entrypoint (seed.sql is run automatically)
supabase db reset --yes
```

2) Using psql (when DATABASE_URL is set or when you connect to PG directly):

```powershell
# example using environment variable to run the master seed
psql $env:DATABASE_URL -f ./supabase/seed.sql
```

検証手順 / クイックチェック ✅

- Supabase CLI でシードのみを実行する（ローカルDBが起動しているか、正しい project がリンクされていることを確認してください）:

```powershell
# Supabase プロジェクトにリンクしているか確認
サーバー
supabase link

ローカル
supabase start

# master シードを実行（ドメイン分割ファイルを順番に適用）
supabase start
supabase db reset --yes
Note: `supabase reset` also runs migration+seed in one go for your linked project.

```

- `supabase db reset` を使うと、マイグレーション → シードの順で DB をリセットできます（注意: reset はデータを消します）:

```powershell
supabase db reset
```

- `psql` で簡易的に確認する例:

```powershell
# DB にサンプルユーザーが入ったか確認
psql $env:DATABASE_URL -c "SELECT id,email FROM public.users ORDER BY id LIMIT 10;"

# works のカテゴリIDが正しく入ったか確認
psql $env:DATABASE_URL -c "SELECT id,title,category_id FROM public.works ORDER BY id LIMIT 10;"
```

- gen_random_uuid() のサポート確認 (point_transactions や root_account_achievements でほとんど使われています):

```powershell
psql $env:DATABASE_URL -c "SELECT gen_random_uuid();"
```

Note: `gen_random_uuid()` が動かない場合は pgcrypto 拡張が無効になっている可能性があります。Supabase のローカル環境では通常有効ですが、エラーが出る場合は `CREATE EXTENSION IF NOT EXISTS pgcrypto;` を手動で実行してください。

Special notes
- `auth.users` triggers: if your project requires synchronizing `auth.users` to `public.users` (the project uses trigger function `handle_new_user`), please ensure the trigger exists. Because of Supabase auth permissions this trigger often must be created manually via the Supabase Dashboard SQL editor; see `drizzle/auth_trigger_manual.sql` in the repo for the required statements.

Auth trigger — どうやって適用するか（手順）
----------------------------------------
- 推奨 (ホストされた Supabase / 本番): Supabase Dashboard の SQL Editor を開いて、リポジトリの `drizzle/auth_trigger_manual.sql` を丸ごと貼り付けて実行してください。`auth` スキーマへの権限制限があるため、ダッシュボード経由で実行するのが最も確実です。
- ローカル開発で Supabase のローカルDB を使っている場合:
	1. ローカルDB を起動: `supabase start`
	2. スクリプトを使う（接続情報は環境変数 DATABASE_URL または SUPABASE_DB_URL を優先します）:

```powershell
# 接続先を上書きしたい場合（例）
$env:DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
npm run db:apply-trigger
```

	3. 成功したか確認:
```powershell
psql $env:DATABASE_URL -c "SELECT trigger_name FROM information_schema.triggers WHERE event_object_schema = 'auth' AND trigger_name = 'on_auth_user_created';"
```

注意: ホストされた Supabase では `auth` スキーマの操作が制限されていて、CLI や通常マイグレーション経由では失敗することが多いです。ダッシュボードの SQL Editor での手動実行を推奨します。
- RLS policies are not included in these seeds. You must add appropriate RLS policies before relying on seed data to validate access rules.

References
- Supabase docs: https://supabase.com/docs/guides
