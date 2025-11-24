-- ==============================================================================
-- 【重要】手動実行が必要です
-- ==============================================================================
-- このスクリプトは、新規ユーザーを `public.users` テーブルに同期するためのトリガーを
-- `auth.users` テーブルに作成します。
--
-- `auth` スキーマに対するセキュリティ制限のため、標準の Drizzle マイグレーションでは
-- 適用できません。必ず Supabase Dashboard の SQL Editor でこの SQL を手動実行してください。
-- ==============================================================================

-- 1. トリガー関数の作成（マイグレーション 0003 で作成されていない場合）
--    注: 通常はマイグレーション 0003 で処理されますが、念のため存在を確認・作成します。
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. auth.users へのトリガー作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 検証
-- 実行後、以下のクエリでトリガーが存在することを確認できます:
-- SELECT * FROM information_schema.triggers WHERE event_object_schema = 'auth' AND trigger_name = 'on_auth_user_created';
