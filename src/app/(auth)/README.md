# Authenticated pages (minimal set)

このディレクトリは 認証済ユーザー向け の最小ページを置くためのルートグループ `(auth)` です。

配置したルート:

- `/home` — 認証後のホーム (プレースホルダ)
- `/onboarding` — オンボーディング (初回ガイド)
- `/tutorial` — チュートリアル (仮)

このグループには `layout.tsx` があり、簡単なサーバー側 cookie チェックによって未認証なら `/login` にリダイレクトします。（実運用では Supabase や外部セッション検証へ置き換えてください）
