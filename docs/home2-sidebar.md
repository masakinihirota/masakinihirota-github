# Home2 Left Sidebar (shadcn-based)

簡単な説明と実装ノート：

- 追加場所: `src/app/home2`
- 主要ファイル:
  - `src/app/home2/components/Sidebar.tsx` — 左サイドメニューの React コンポーネント
  - `src/app/home2/layout.tsx` — サイドバーを含むレイアウト
  - `src/app/home2/page.tsx` — サンプルページ
  - `src/components/home2/Sidebar.test.tsx` — サイドバーのユニットテスト（Vitest）

実装方針: shadcn スタイルに合わせた Tailwind クラスを用い、既存の UI 設計に整合させています。

テスト: ユニットテストは `pnpm test` で実行できます（ローカル DB や他のテストに依存するため、全体テストは環境により失敗する場合があります）。
