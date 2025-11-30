# Home3 — 認証後トップページ（route.json を使わない静的メニュー）

実装ノート:

- 追加場所: `src/app/home3`
- 主要ファイル:
  - `src/app/home3/components/Sidebar.tsx` — 左サイドメニュー（静的配列で定義、shadcn 風スタイル）
  - `src/app/home3/layout.tsx` — サイドバーを含むレイアウト
  - `src/app/home3/page.tsx` — トップページのサンプルコンテンツ
  - `src/components/home3/Sidebar.test.tsx` — Sidebar のユニットテスト（Vitest）

特徴:
- route.json / routes.manifest.json を利用せず、コンポーネント内で静的にメニュー項目を定義しています。
- shadcn で使われる Tailwind クラスと既存 `@/components/ui/*` の Badge コンポーネントを使って UI を構築しています。

将来の拡張案:
- RBAC による表示制御（menu item の access_role を待機）
- 未読数やバッジをリアルタイムに更新するための通知 API 統合
- ユーザーごとのカスタマイズ（ピン留め / ショートカット領域）
