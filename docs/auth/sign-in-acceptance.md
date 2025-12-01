# サインイン (Sign-in) — 受け入れ基準

この文書は認証 (Sign-in) 機能の最小限の受け入れ基準を定義します。TDD サイクルでの実装／テストはこの受け入れ基準に従って進めます。

必須 (MUST)
- ユーザーは「Sign in with Google」ボタンが見えること。
- ボタンをクリックした際、クライアントは Supabase の OAuth signInWithOAuth を呼び出すこと（provider ごとに呼出し）
- サインイン処理中はボタンが loading 状態となり、押下不可になること。テキストは "Connecting..." を表示すること。
- OAuth のコールバックは /auth/callback にリダイレクトされること（redirectTo を設定）

望ましい (SHOULD)
- 将来的には複数プロバイダ (Google / GitHub / etc.) を選択できる UI を持つこと。

テストで検証する項目（例）
- LoginForm は Google のログインボタンをレンダリングする
- LoginForm のボタンを押すと、signInWithOAuth が provider: 'google' で呼ばれる
- ログインボタン押下中は disabled + 表示が connecting に変わる
