---
applyTo: "**"
---

このファイルは「UI ページ実装」のための公式指示書です。以下のルールに従って、design ドキュメント（`vns-masakinihirota-design/0016 UIデザイン` 配下の各 md）に基づき **実際に UI ページを実装**してください。

主な要点:

- 実装は TDD サイクル（RED → GREEN → REFACTOR）で行うこと。1 つの変更につき "失敗するテストは 1 つだけ" を守ること。
- テストは必ずコンポーネントと同じディレクトリに配置し、@vitest-environment jsdom を使用して UI テストを実行すること。
- 実装したページは認証後メニュー（`/home`）からリンクできるように配置すること。
- Shadcn/UI と Radix UI を活用して、Tailwind CSS でスタイリングすること。新しい UI コンポーネントは CLI（`pnpm dlx shadcn@latest add <component>`）で追加する。
- 大きな副作用（API/DB）は `*.fetch.tsx` や専用 hook に分離し、ページは表示とコンポーネント組み立てに専念すること。

以下のチェックリストは残り作業を示します。進捗はこのファイルのチェック項目と repository の TODO を同期して更新してください。

- [ ] Matching: 結果一覧テスト (RED)
- [ ] Matching: 結果一覧実装 (GREEN)
- [ ] Matching: 結果詳細テスト (RED)
- [ ] Matching: 結果詳細実装 (GREEN)
- [ ] Matching: 設定画面テスト (RED)
- [ ] Matching: 設定画面実装 (GREEN)
- [ ] Profile: プロフィール作成テスト (RED)
- [ ] Profile: プロフィール作成実装 (GREEN)
- [ ] Profile: プロフィール編集テスト (RED)
- [ ] Profile: プロフィール編集実装 (GREEN)
- [ ] Account: ルートアカウント画面テスト (RED)
- [ ] Account: ルートアカウント設定実装 (GREEN)
- [ ] Organization: 組織作成テスト (RED)
- [ ] Organization: 組織作成実装 (GREEN)
- [ ] Organization: 組織編集テスト (RED)
- [ ] Organization: 組織編集実装 (GREEN)
- [ ] Organization: 組織管理テスト (RED)
- [ ] Organization: 組織管理実装 (GREEN)
- [ ] Organization: 組織設定テスト (RED)
- [ ] Organization: 組織設定実装 (GREEN)
- [ ] Nation: 国作成テスト (RED)
- [ ] Nation: 国作成実装 (GREEN)
- [ ] Nation: 国編集テスト (RED)
- [ ] Nation: 国編集実装 (GREEN)
- [ ] Nation: 国管理テスト (RED)
- [ ] Nation: 国管理実装 (GREEN)
- [ ] Nation: 国設定テスト (RED)
- [ ] Nation: 国設定実装 (GREEN)
- [ ] Content: 価値観一覧テスト (RED)
- [ ] Content: 価値観一覧実装 (GREEN)
- [ ] Content: 作品一覧テスト (RED)
- [ ] Content: スキル一覧テスト (RED)
- [ ] Other: 通知一覧テスト (RED)
- [ ] Other: 通知詳細テスト (RED)
- [ ] Other: 検索画面テスト (RED)
- [ ] Other: 設定画面テスト (RED)
- [ ] Other: ヘルプ/FAQ/お問い合わせテスト (RED)
- [ ] Other: おすすめページ実装 (GREEN)
- [ ] Static: HOME / メニュー / LP 実装 (ページ群)
- [ ] Admin: 管理者ホーム・ユーザー管理等 (最小実装)

# shadcn/ui LLM UI 開発指示書（2025）

_最終更新: 2025 年 7 月_

- 常に fetch ツールを使用して、公式 shadcn/ui ドキュメント（https://ui.shadcn.com/docs/components）から最新のコンポーネント使用法、インストール名、ベストプラクティスを確認してください。
- shadcn/ui コンポーネントは頻繁に更新・改善されるため、過去の知識や学習データに頼らないでください。
- shadcn/ui のコンポーネント、CLI コマンド、または使用パターンに関しては、該当ページを必ずフェッチしてドキュメントの指示に従ってください。

**基本方針:**

- shadcn/ui コンポーネントはオープンコードです。コンポーネントを直接読み、必要に応じて修正・拡張してください。
- コンポーネントの追加や更新は CLI を使って行ってください（例: `pnpm dlx shadcn@latest add <component>`）。
- 常にローカルの `@/components/ui/<component>` からインポートしてください。
- ドキュメントに記載されたアクセシビリティやコンポジションのベストプラクティスに従ってください。

**まとめ:**

> shadcn/ui に関する作業では、必ず fetch ツールで公式ドキュメント（https://ui.shadcn.com/docs/components）を確認し、静的な指示に依存しないでください。
