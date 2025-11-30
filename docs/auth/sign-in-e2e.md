# Sign-in — 簡易 e2e / 手動検証手順

このドキュメントはローカル環境で Sign-in（OAuth）フローを手動で検証する最小手順をまとめたものです。

前提
- Supabase ローカル開発サーバ（CLI）または適切な NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていること。

手順
1. 環境変数を設定する（例）:
   - NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_local_anon_key>
2. 開発サーバを起動: pnpm dev
3. ブラウザで http://localhost:3000/login にアクセス
4. "Sign in with Google" または "Sign in with GitHub" ボタンをクリック
5. OAuth プロバイダの挙動と /auth/callback へのリダイレクトを確認

期待される結果
- ボタン押下で signInWithOAuth が呼ばれ、ブラウザが認可ページにリダイレクトされるか、もしくはエミュレートされた応答によって /auth/callback にリダイレクトされる。

トラブルシュート
- 環境変数未設定の場合は、テストで createClient が informative なエラーを出す（unit test で確認済み）。
