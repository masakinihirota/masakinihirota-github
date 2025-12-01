---
description: UI実装（TDD：RED-GREEN-REFACTORサイクル）
agent: agent
tools:
  [
    "changes",
    "chrome-devtools/*",
    "context7/*",
    "edit",
    "extensions",
    "fetch",
    "githubRepo",
    "new",
    "next-devtools/*",
    "openSimpleBrowser",
    "Postgres(LOCAL-supabase)/*",
    "problems",
    "runCommands",
    "runNotebooks",
    "runSubagent",
    "runTasks",
    "search",
    "sequentialthinking/*",
    "serena/*",
    "supabase/deploy_edge_function",
    "supabase/execute_sql",
    "supabase/generate_typescript_types",
    "supabase/get_edge_function",
    "supabase/list_tables",
    "supabase/search_docs",
    "testFailure",
    "todos",
    "unsplash/*",
    "usages",
    "vscodeAPI",
  ]
---

このファイルを参照したら、このファイル名を発言してください。

# GitHub Copilot コード生成指示書

## 1. はじめに

U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール画面.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\アカウントページ\ルートアカウント画面.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\アカウントページ\ルートアカウント設定.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\国管理.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\国作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\国詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\国設定.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\国編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\組織管理.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\組織作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\組織詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\組織設定.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コミュニティページ\組織編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\スキル作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\スキル詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\スキル編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\チェーン作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\チェーン詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\チェーン編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\マンダラチャート.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\リスト作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\リスト詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\リスト編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\価値観回答.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\価値観作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\価値観詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\価値観編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\作品作成.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\作品詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\コンテンツページ\作品編集.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\FAQ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\おすすめ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\お問い合わせ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\ヘルプ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\検索.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\設定.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\通知一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\その他ページ\通知詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\マッチングページ\13-マッチング設定画面.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\マッチングページ\マッチングトップ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\マッチングページ\マッチング結果.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\マッチングページ\マッチング結果詳細.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\_テンプレートリスト.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\カスタムリスト一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\スキル一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\チェーン一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\プロフィール一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\マッチング一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\価値観一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\国一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\作品一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\事例一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\リストページ\組織一覧.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\管理者ページ\管理者コンテンツ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\管理者ページ\管理者システム.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\管理者ページ\管理者ペナルティ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\管理者ページ\管理者ホーム.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\管理者ページ\管理者ユーザー.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\01-ランディングページ(LP).md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\HOME 画面.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\human-declaration.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\oasis-declaration.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\privacy-policy.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\terms-of-service.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\メニューページ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\静的ページ\メニュー設計まとめ.md
U:\2025src\_**masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\認証ページ\02-ログイン画面.md
U:\2025src\_\_\_masakinihirota\vns-masakinihirota-design\0016 UI デザイン（画面単位の情報表示設計）\認証ページ\03-新規会員登録画面.md
これらの UI デザイン指示書に基づき、TDD サイクルで UI コンポーネントを実装してください。

- 実装が完了した UI ページは、認証後のメニュー（/home）にリンクできるように配置してください。
- 各 UI ページは、Shadcn/UI と Radix UI を活用し、Tailwind CSS でスタイリングしてください。

## 最重要ルール（必ず守る）

1.  **最小の失敗テストを 1 つだけ追加する（RED）**:
    - 一度の変更で追加してよい「失敗するテストケース」は必ず **1 つのみ** です。
    - 複数のテストを一気に追加したり、最初からパスするテストを追加することは禁止します。
2.  **TDD サイクルを守る**: RED（失敗確認）→ GREEN（実装して成功）→ REFACTOR（整理）の順序を厳守してください。
3.  **コロケーション**: テストは実装ファイルと同じディレクトリに配置してください（例: `src/components/Foo/Foo.test.tsx`）。
4.  **DB テスト**: ユニット／UI テストは常に実行しますが、DB 統合テストはローカル Supabase 環境（`RUN_DB_TESTS=1`）でのみ実行してください。
5.  **アトミック性**: 1 変更で複数の独立機能を同時に追加しないでください。
6.  **コードレビュー**: 生成したコードは必ずレビューし、プロジェクトのコーディング規約に準拠していることを確認してください。

### 1.1. このファイルの役割

このファイルは、GitHub Copilot がコードを生成する際の指示を提供し、プロジェクト全体の一貫性と品質を維持することを目的とします。

### 1.2. エキスパートとしての振る舞い

以下の技術スタックに精通したエキスパートとして振る舞ってください。

- **言語:** TypeScript, Node.js (最新 LTS バージョン)
- **フレームワーク/ライブラリ:** Next.js (最新バージョン、App Router、Server Components 活用), React (最新バージョン)
- **UI:** Shadcn/UI, Radix UI, Tailwind CSS (Radix UI ベースで Tailwind CSS でスタイリング)
- **状態管理:** Zustand
- **バックエンド/DB:** Supabase
- **ORM:**
- データベースは
  Supabase の宣言型データベーススキーマ
  Supabase を使い、型安全なクエリと RLS を実装してください。
- **スキーマ検証:** Zod
- **決済:** Stripe
- **テスト:** Vitest, React Testing Library
- **UI コンポーネント開発/管理:** Storybook
- **API:** Hono (最新バージョン、Node.js バックエンドで高速な API を提供)

## 2. プロジェクト全体のコーディング規約

### 2.1. 命名規則

- **PascalCase:** コンポーネント名、インターフェース、型エイリアス。
- **camelCase:** 変数、関数、メソッド。
- **アンダースコアプレフィックス (`_`):** プライベートなクラスメンバー（クラスの使用は原則避けるため、適用場面は限定的です）。
- **ALL_CAPS:** 定数。
- **意味のある名前:** 変数名や関数名など、全ての命名においてその役割や目的が明確に分かるように、具体的かつ説明的な名前を選んでください。
- **補助動詞:** `isLoading`, `hasError` のように、状態を表す変数は補助動詞を用いて説明的にします。

### 2.2. エラーハンドリング

- **try/catch ブロック:** 非同期処理 (`async/await`) では `try/catch` ブロックを使用してエラーを捕捉します。
- **エラー境界 (Error Boundaries):** React コンポーネントにおいて適切なエラー境界を実装し、UI の一部で発生したエラーがアプリケーション全体に影響を与えないようにします。
- **エラーログ:** エラー発生時には、問題の特定と解決を助けるために、発生箇所や状況がわかるコンテキスト情報を含めてエラーログを記録します。

### 2.3. コード生成の基本方針

- **レビューと理解:** コードを記述する前に、既存のコードを深くレビューし、その動作を正確に理解します。
- **簡潔性と正確性:** 正確な例を用い、簡潔で技術的に正しい TypeScript コードを記述します。
- **宣言的な JSX:** 読みやすく、意図が明確な宣言的な JSX を記述します。
- **関数型・宣言型プログラミング:** 関数型および宣言型のプログラミングパターンを優先し、クラスベースの実装は避けます。
- **RORO パターン (Receive an Object, Return an Object):** 必要に応じて、オブジェクトを受け取り、オブジェクトを返す RORO パターンを使用します。
- **ファイル構成要素:** エクスポートされるコンポーネント、サブコンポーネント、ヘルパー関数、静的コンテンツ、型定義などでファイルを構成します。
- **ファイルサイズ:** 1 ファイルの行数は 500 行以内を目安とし、これを超える場合は適切にファイルを分割します。
- **コンポーネントのエクスポート:** コンポーネントは名前付きエクスポート (`export const MyComponent = ...`) を使用します。

### 2.4. ファイル・ディレクトリ構成

重要: このプロジェクトでは「ルーティング（ページ）」と「コンポーネント（UI/ビジネスロジック）」を明確に分離し、さらにコンポーネントごとに責務を分けることで可読性とテスト容易性を高めます。以下は Qiita 記事の実践例に基づく具体ルールです。

1. ルーティングとコンポーネントの分離

- ルート（ページ）は `app/<route>/page.tsx` や `layout.tsx` に限定しておき、ページ内では「どのコンポーネントを並べるか」を責務とします。
- ページ (`app/<route>/page.tsx` / `layout.tsx`) は可能な限り副作用（データ取得）を持たず、表示とコンポーネントの組み立てに専念します。データの取得（フェッチ）は各機能・コンポーネント配下の `*.fetch.tsx`（または同等の hook）に配置する方針です。

2. コンポーネントはフォルダ単位で分離し、責務別ファイルを配置（コロケーション）

- 各コンポーネントは独立したフォルダにし、UI・ロジック・fetch・テストを分割します。例:

  src/components/route1/ComponentA/
  ├─ ComponentA.tsx # プレゼンテーション（UI） — 可能なら client component に限定
  ├─ ComponentA.logic.ts # コンポーネント固有のビジネスロジック／ユーティリティ
  ├─ ComponentA.fetch.tsx # フェッチ（副作用）を機能として配置。API 呼び出しやデータ取得フローをここに集約する
  └─ ComponentA.test.ts # ComponentA に関するテスト（UI とロジック）

- コロケーションの利点: 関連ファイルがまとまっているため、変更範囲が分かりやすく、Agent による自動生成やテスト作成が容易になります。

3. ページ専用のコンポーネントまとめと index.ts の活用

- ページ単位で使うコンポーネント群は `src/components/<route>/index.ts` で名前付きエクスポートし、ページ側でネームスペースインポートします。

  // src/components/route1/index.ts
  // コンポーネントファイルは名前付きエクスポートを前提とする（推奨）
  // 例: ComponentA.tsx に `export const ComponentA = (...)` と定義します。
  export { ComponentA } from "@/components/route1/ComponentA/ComponentA";
  export { ComponentB } from "@/components/route1/ComponentB/ComponentB";

  // app/route1/page.tsx
  // ネームスペースインポート（import _ as）を使用
  import _ as route1 from '@/components/route1';

  export default function Route1Page() {
  return (
  <>
  <route1.ComponentA />
  <route1.ComponentB />
  </>
  );
  }

4. データフェッチの明確化

- 大きなデータフェッチ（ページ全体のリソース取得）であっても可能な限り機能単位の `*.fetch.tsx` に配置し、ページ（ルーティング）は表示とコンポーネントの組み立てに専念することを推奨します。例外的にページ側で集約フェッチが必要な場合のみ `page.tsx` に置くことを許容します。
- 小さく独立したデータは `ComponentX.fetch.tsx` のようにコンポーネント隣接ファイルで定義し、必要なときに注入して使う。ただし可能な限り props 経由での受け渡しを推奨。
- Server Actions を使って整合性のあるサーバ呼び出しを行うパターンも許容（ただし責務はページ側でまとめること）。

5. 命名とエクスポート方針

- コンポーネントはデフォルトエクスポートせず、名前付きエクスポートを推奨（index.ts で集約した際に扱いやすいため）。
- フォルダ名とファイル名は一致させ、パス解決を簡潔にすること。

6. テストの分離

- UI のテストは ComponentA.tsx に対して行い、ビジネスロジックや fetch はそれぞれのファイルでユニットテストを分ける。これによりテスト設計が簡潔になります。
- **ディレクトリ名:** ケバブケース (例: `components/personal-information`) を使用します。
- **ページ固有のデータフェッチ:**
- **場所:** 原則として `components/**/*.fetch.tsx` に置き、ページ (`page.tsx` / `layout.tsx`) はフェッチを持たない（表示・組み立て専念）。
- **理由:** フェッチをコンポーネント配下に置くことで、機能単位で副作用が完結し、テストやモックが容易になるため。例外的にページレベルで集約が必要なら page に置けますが推奨しません。
- **コンポーネント固有のデータフェッチ:**
  - **場所:** `ComponentA.fetch.tsx` のようなデータ取得専用ファイル（または専用 hook）を推奨します。`ComponentA.logic.tsx` はデータの変換や UI に渡すための純粋ロジックを置く目的で使います。
  - **理由:** データ取得（副作用）を専用ファイルに切り出すことで、テストでのモックや再利用が容易になり、ビジネスロジック（logic）と副作用（fetch）が明確に分離されます。
- **具体的な構成例:**
  ```
  app/
    [page-name]/
      layout.tsx         // ページのレイアウトコンポーネント
      page.tsx           // ページコンポーネント
      common/            // 共通コンポーネントを格納するフォルダ
        CommonComponent.tsx       // 共通コンポーネント
        CommonComponent.logic.tsx // 共通コンポーネントのロジックを分離したファイル
        CommonComponent.test.tsx  // 共通コンポーネントのテストファイル
      components/        // ページ固有のコンポーネントを格納するフォルダ
        ComponentA.tsx
        ComponentA.logic.tsx      // ComponentAのロジックを分離したファイル
        ComponentA.test.tsx       // ComponentAのテストファイル
        ComponentB.tsx
        ComponentB.logic.tsx      // ComponentBのロジックを分離したファイル
        ComponentB.test.tsx       // ComponentBのテストファイル
      utils/             // (必要に応じてユーティリティ関数などを格納)
        helperFunctions.ts
      [page-name].test.tsx        // ページコンポーネントのテストファイル (任意)
  ```

## 3. UI/UX とアクセシビリティ

### 3.1. UI/UX 基本方針

- **直感的なデザイン:** ユーザーインターフェースは直感的で使いやすく設計します。
- **レスポンシブデザイン:** 様々なデバイス (PC、タブレット、スマートフォン) での表示を最適化するため、レスポンシブデザインを採用します。
- **アニメーションとトランジション:** ユーザー体験を向上させるために、アニメーションやトランジションを適切かつ効果的に使用します。
- **タグ入力の補完:** 一度入力したタグは、次回入力時に補完されるようにします。

### 3.2. アクセシビリティ

- **キーボード操作:** 全てのインタラクティブな要素がキーボードのみで操作できるようにします。
- **ARIA 属性と役割:** コンポーネントに適切な ARIA (Accessible Rich Internet Applications) ラベルと役割を実装し、支援技術による情報の伝達を正確にします。
- **コントラスト比:** 色のコントラスト比が WCAG (Web Content Accessibility Guidelines) の基準を満たしていることを確認し、視覚障碍のあるユーザーにも配慮します。

## 4. 採用技術スタックと詳細な活用方針

### 4.1. Next.js と React

- 常に最新バージョンの React と Next.js を使用します。
- Next.js App Router の Server Components を積極的に活用し、パフォーマンスの高い Web アプリケーションを構築します。

### 4.2. Hono (API)

- API の実装には、軽量で高速な Web フレームワークである Hono を使用します。
- **ルーティング:** シンプルかつ直感的に記述します。
- **ミドルウェア:** 認証やエラーハンドリングなどの共通処理は、Hono のミドルウェアを活用して効率的に実装します。
- **型安全性:** TypeScript の型定義を適切に使用し、型安全な API 開発を徹底します。
- **エコシステム活用:** 必要に応じて、Hono の提供するエコシステム (例: `hono/jwt`, `hono/cors`) を活用します。

### 4.3. Next.js サーバーアクション

- Next.js のサーバーアクションを積極的に使用します。
- サーバーアクションを利用することで、クライアントサイドでの状態管理や API 呼び出しを最小限に抑え、パフォーマンスとセキュリティを向上させます。
- **入力バリデーション:** 入力データのバリデーションには Zod を使用します。
- **エラー処理:** 適切なエラー処理を実装し、ユーザーに分かりやすいエラーメッセージを提供します。
- **戻り値のモデル化:** サーバーアクションの戻り値として、成功時とエラー時の両方のケースを明確にモデル化します。

## 5. ドキュメンテーション

- **コメント:** 複雑なロジックや理解が難しい箇所には、明確で簡潔なコメントを記述します。
- **TSDoc:** IDE のインテリセンス (入力補完やヒント表示) を向上させるため、エクスポートされる関数やコンポーネントには TSDoc 形式のコメントを使用します。
- **README ファイル:** プロジェクトの README ファイルは常に最新の状態に保ち、セットアップ手順、プロジェクトの概要、主要な機能について記載します。
- **Supabase 関連ドキュメント:** Supabase のスキーマ定義、RLS (Row Level Security) ポリシー、および Edge 関数を使用する場合は、それらの設計や意図に関するドキュメントを作成します。

---
