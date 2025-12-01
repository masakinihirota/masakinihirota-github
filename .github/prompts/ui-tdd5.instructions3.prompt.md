---
description: 指示書に書かれたUIをTDDで実装する（TDD：RED-GREEN-REFACTORサイクル）
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

## 目的

このプロンプトは、vns-masakinihirota の画面設計（例: vns-masakinihirota-design/0016 UIデザイン 以下）に沿って
UI コンポーネントを TDD（RED → GREEN → REFACTOR）で実装するための実行指示です。



U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール画面.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\アカウントページ\ユーザープロフィール編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\アカウントページ\ルートアカウント画面.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\アカウントページ\ルートアカウント設定.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\国管理.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\国作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\国詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\国設定.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\国編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\組織管理.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\組織作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\組織詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\組織設定.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コミュニティページ\組織編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\スキル作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\スキル詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\スキル編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\チェーン作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\チェーン詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\チェーン編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\マンダラチャート.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\リスト作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\リスト詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\リスト編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\価値観回答.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\価値観作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\価値観詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\価値観編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\作品作成.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\作品詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\コンテンツページ\作品編集.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\FAQ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\おすすめ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\お問い合わせ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\ヘルプ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\検索.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\設定.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\通知一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\その他ページ\通知詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\マッチングページ\13-マッチング設定画面.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\マッチングページ\マッチングトップ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\マッチングページ\マッチング結果.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\マッチングページ\マッチング結果詳細.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\_テンプレートリスト.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\カスタムリスト一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\スキル一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\チェーン一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\プロフィール一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\マッチング一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\価値観一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\国一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\作品一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\事例一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\リストページ\組織一覧.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\管理者ページ\管理者コンテンツ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\管理者ページ\管理者システム.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\管理者ページ\管理者ペナルティ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\管理者ページ\管理者ホーム.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\管理者ページ\管理者ユーザー.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\01-ランディングページ(LP).md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\HOME画面.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\human-declaration.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\oasis-declaration.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\privacy-policy.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\terms-of-service.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\メニューページ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\静的ページ\メニュー設計まとめ.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\認証ページ\02-ログイン画面.md
U:\2025src\___masakinihirota\vns-masakinihirota-design\0016 UIデザイン（画面単位の情報表示設計）\認証ページ\03-新規会員登録画面.md
これらの UI デザイン指示書に基づき、TDD サイクルで UI コンポーネントを実装してください。

- 実装が完了した UI ページは、認証後のメニュー（/home）にリンクできるように配置してください。

ページ実装はリポジトリの実装ガイド（`.github/instructions/.copilot-instructions.md`）に従って行ってください。

これらの指示書に従い、UI コンポーネントを実装してください（完成後は /home メニューへリンクできるようにしてください）。

## 最重要ルール（必ず守る）

1.  **最小の失敗テストを 1 つだけ追加する（RED）**:
    - 一度の変更で追加してよい「失敗するテストケース」は必ず **1 つのみ** です。
    - 複数のテストを一気に追加したり、最初からパスするテストを追加することは禁止します。
2.  **TDD サイクルを守る**: RED（失敗確認）→ GREEN（実装して成功）→ REFACTOR（整理）の順序を厳守してください。
3.  **コロケーション**: テストは実装ファイルと同じディレクトリに配置してください（例: `src/components/Foo/Foo.test.tsx`）。
4.  **DB テスト**: ユニット／UI テストは常に実行しますが、DB 統合テストはローカル Supabase 環境（`RUN_DB_TESTS=1`）でのみ実行してください。
5.  **アトミック性**: 1 変更で複数の独立機能を同時に追加しないでください。

## 実行手順（必須フロー）


次に実装すべき「最小の機能単位」を特定する。

1.  **RED（テスト作成）**:

    - 最小の失敗テストケースを **1 つだけ** `src/.../<Target>.test.(ts|tsx)` に追加する。
    - `runTests` を実行する。
    - **検証**:
      - 追加したテストが **期待通りに失敗すること** を確認する。
      - もしテストがパスしてしまった場合は、テストコードが間違っているか、テスト対象が適切でないため、修正する。
      - コンパイルエラー（型エラー等）でテストが実行できない状態は RED とみなさない。最低限テストが走る状態（スタブ作成など）にしてから失敗させること。

2.  **GREEN（実装）**:

    - `edit` で最小限の実装を追加し、`runTests` を再実行して該当テストをパスさせる。
    - この段階ではコードの美しさよりも「テストを通すこと」を優先してよい。

3.  **REFACTOR（リファクタリング）**:

    - テストが通った状態で、可読性向上・重複排除・型安全性の改善を行う。
    - 必要な場合、`supabase/generate_typescript_types` を実行して型定義を更新する。
    - **重要**: 機能（振る舞い）を変えてはならない。リファクタリング後に再度 `runTests` を行い、全てのテストが GREEN であることを確認する。

4.  **自動チェックとレビュー**:

    - 静的解析（`lint`等）を実行し、問題がないか確認する。
    - 自身の変更に対し、以下の観点で自己レビューを行う:
      - 新規に追加された「失敗 → 成功」したテストケースは 1 つか？
      - 既存の他のテストを壊していないか（回帰テスト）？
      - `implementation_plan.md` の要件を満たしているか？

5.  **完了記録**:
    - 問題がなければ、`serena/*` を使用して作業ログ、変更ファイル一覧、RED→GREEN の証跡を残す。
    - 完了したタスクがあれば `implementation_plan.md` や `mvp_tasks.md` にチェックマークを入れてください。
    - ユーザーには問題が発生するなどのトラブルがない限り実装すべき項目が終わるまで指示を仰ぐのは禁止。
    - まだ実装すべき項目が残っている場合は、次の TDD サイクルへ進む。

## 出力フォーマット（完了時）

以下の情報を構造化して出力すること：

1.  **変更ファイル一覧**（フルパス）
2.  **TDD 実行ログ要約**:
    - 追加したテスト名: `Describe > It should ...`
    - RED 時のエラーメッセージ抜粋
    - GREEN 時の成功確認
3.  **実装内容の要約**（1-3 行）
4.  **次アクションの提案**:
    - 次に実装すべきテストケースの提案
    - または、残作業の確認

## ガードレール（自動チェック）

- エージェントは `testFailure` ツールまたはテスト実行ログの解析を通じて、「今回追加された失敗テスト数が 1 であること」を常に監視してください。

  - 具体的には、テスト実行時の失敗数を検査するか、直近の Git diff で "新規追加されたテストのうち FAIL している数" を検出してください。
  - テスト実行ログからの判定では、ファイル単位で新規作成されたテストファイルの中で失敗している count===1 を期待値とします。
  - 自動判定で不確実な場合は、該当テストファイルの名前と一つだけ失敗していることのスクリーンショット（ログ抜粋）を作業証跡として残してください。

  ※ 参考／自動化補助: リポジトリには `scripts/check-new-tests.js` と npm スクリプト `pnpm check:new-tests` を追加しました。これは

  - Git の差分（origin/main...HEAD）から新規に追加されたテストファイルを検出し、
  - それらに対して `vitest --reporter=json` を実行して JSON を解析し、"新規に追加された失敗テスト" の数を取得します。
  - 成功条件は `new failing test count === 1` です（違う場合は非ゼロ終了コードで失敗します）。

  Agent は内部チェックとして `pnpm check:new-tests` を呼び出して厳密判定を行うことができます（CLI／CI どちらでも利用可）。

## integration テストの取扱い（明確化）

- Integration / DB 必須テストの規約:
  - integration レベルのテストは必ず `tests/integration/**` 配下に配置してください。
  - Integration テストはローカル DB / Supabase に依存するため、実行するときは必ず環境変数 `RUN_DB_TESTS=1` を付けてください。CI で自動的に走らせないことを強制します。
  - Agent が integration テストを走らせる場合は、`RUN_DB_TESTS` の有無をチェックし、無い場合はスキップして下さい（失敗とみなさない）。

## 完了時のコミット／更新ルール（自動化しやすく）

- 作業完了時のコミットメッセージテンプレート（推奨）:
  - `TDD: complete <mvp_tasks.md#TaskIdentifier> — <short-description>`
  - 例: `TDD: complete mvp_tasks.md#Task 5.1.1 — ignore resource-scoped exceptions for global checks`
- 作業後は `mvp_tasks.md` の該当行にチェックを入れ、変更のコミットに必ず含めてください。Agent は `mvp_tasks.md` の該当タスク行を更新することを忘れないでください。

## 変更検証とエビデンス

- Agent は RED→GREEN→REFACTOR の各ステップのログ（コマンドの結果）を作業証跡として保存または `serena/*` に記録してください。ログは短い抜粋でよいので、RED の失敗メッセージ、GREEN のテスト成功行、最後に lint 結果を含めてください。

## タスク整合性ルール（必須）

実装と `implementation_plan.md` / `mvp_tasks.md` のチェックマークが一致していないことは混乱の元です。以下のルールを必ず守ってください。

1. 実装後の検証

   - RED→GREEN→REFACTOR の各サイクルが完了したら、必ず `implementation_plan.md` と `mvp_tasks.md` を確認し、該当する項目のチェックマークが現実の実装状態を正しく反映していることを確認してください。
   - もしチェックマークが事実と異なる場合（未実装なのにチェックが入っている、実装済みなのにチェックがない等）は、修正（チェックの追加/除去）を行い、その理由をコミットメッセージと `serena` の作業ログに残してください。

2. 指示が不足している場合の対応

   - `implementation_plan.md` や `mvp_tasks.md` に「次に何をするか」の記述がない、もしくは曖昧な場合は、この `jisou.prompt.md` に短く明確な実行指示（1〜2 行）を追記してください。指示は日本語で、目的と最小の RED テストを書いた後の次アクションを示すこと。
   - 追記した指示は TDD の流れ（RED→GREEN→REFACTOR）で実施可能であることを確認し、対応するテスト／実装ファイルパスも併記してください。

3. ドキュメント編集の運用ルール
   - ドキュメント（`implementation_plan.md` / `mvp_tasks.md` / `jisou.prompt.md`）の変更は必ず小さなコミットで行い、変更理由を説明するコミットメッセージを付してください。
   - 変更によってテストや CI に影響がある場合は、必ずローカルでテストを実行してからコミットしてください。

これらのルールを守ることで、実装状況とタスクリストを一貫して保てます。




### 1.2. エキスパートとしての振る舞い
以下の技術スタックに精通したエキスパートとして振る舞ってください。

-   **言語:** TypeScript, Node.js (最新LTSバージョン)
-   **フレームワーク/ライブラリ:** Next.js (最新バージョン、App Router、Server Components活用), React (最新バージョン)
-   **UI:** Shadcn/UI, Radix UI, Tailwind CSS (Radix UIベースでTailwind CSSでスタイリング)
-   **状態管理:** Zustand
-   **バックエンド/DB:** Supabase
-   **ORM:** Drizzle ORM（推奨）
-   **データベース:** Supabase（宣言型スキーマを利用）。型安全なクエリと RLS（Row Level Security）を実装してください。
-   **スキーマ検証:** Zod
-   **決済:** Stripe
-   **テスト:** Vitest, React Testing Library
-   **UI コンポーネント開発/管理:** Storybook
-   **API:** Hono (最新バージョン、Node.jsバックエンドで高速なAPIを提供)

## 2. プロジェクト全体のコーディング規約

### 2.1. 命名規則
-   **PascalCase:** コンポーネント名、インターフェース、型エイリアス。
-   **camelCase:** 変数、関数、メソッド。
-   **アンダースコアプレフィックス (`_`):** プライベートなクラスメンバー（クラスの使用は原則避けるため、適用場面は限定的です）。
-   **ALL_CAPS:** 定数。
-   **意味のある名前:** 変数名や関数名など、全ての命名においてその役割や目的が明確に分かるように、具体的かつ説明的な名前を選んでください。
-   **補助動詞:** `isLoading`, `hasError` のように、状態を表す変数は補助動詞を用いて説明的にします。

### 2.2. エラーハンドリング
-   **try/catchブロック:** 非同期処理 (`async/await`) では `try/catch` ブロックを使用してエラーを捕捉します。
-   **エラー境界 (Error Boundaries):** Reactコンポーネントにおいて適切なエラー境界を実装し、UIの一部で発生したエラーがアプリケーション全体に影響を与えないようにします。
-   **エラーログ:** エラー発生時には、問題の特定と解決を助けるために、発生箇所や状況がわかるコンテキスト情報を含めてエラーログを記録します。

### 2.3. コード生成の基本方針
-   **レビューと理解:** コードを記述する前に、既存のコードを深くレビューし、その動作を正確に理解します。
-   **簡潔性と正確性:** 正確な例を用い、簡潔で技術的に正しいTypeScriptコードを記述します。
-   **宣言的なJSX:** 読みやすく、意図が明確な宣言的なJSXを記述します。
-   **関数型・宣言型プログラミング:** 関数型および宣言型のプログラミングパターンを優先し、クラスベースの実装は避けます。
-   **ROROパターン (Receive an Object, Return an Object):** 必要に応じて、オブジェクトを受け取り、オブジェクトを返すROROパターンを使用します。
-   **ファイル構成要素:** エクスポートされるコンポーネント、サブコンポーネント、ヘルパー関数、静的コンテンツ、型定義などでファイルを構成します。
-   **ファイルサイズ:** 1ファイルの行数は500行以内を目安とし、これを超える場合は適切にファイルを分割します。
-   **コンポーネントのエクスポート:** コンポーネントは名前付きエクスポート (`export const MyComponent = ...`) を使用します。

### 2.4. ファイル・ディレクトリ構成

重要: このプロジェクトでは「ルーティング（ページ）」と「コンポーネント（UI/ビジネスロジック）」を明確に分離し、さらにコンポーネントごとに責務を分けることで可読性とテスト容易性を高めます。以下は Qiita 記事の実践例に基づく具体ルールです。

1) ルーティングとコンポーネントの分離
- ルート（ページ）は `app/<route>/page.tsx` や `layout.tsx` に限定しておき、ページ内では「どのコンポーネントを並べるか」を責務とします。
 - ページ (`app/<route>/page.tsx` / `layout.tsx`) は可能な限り副作用（データ取得）を持たず、表示とコンポーネントの組み立てに専念します。データの取得（フェッチ）は各機能・コンポーネント配下の `*.fetch.tsx`（または同等の hook）に配置する方針です。

2) コンポーネントはフォルダ単位で分離し、責務別ファイルを配置（コロケーション）
- 各コンポーネントは独立したフォルダにし、UI・ロジック・fetch・テストを分割します。例:

  src/components/route1/ComponentA/
    ├─ ComponentA.tsx         # プレゼンテーション（UI） — 可能なら client component に限定
    ├─ ComponentA.logic.ts    # コンポーネント固有のビジネスロジック／ユーティリティ
    ├─ ComponentA.fetch.tsx   # フェッチ（副作用）を機能として配置。API 呼び出しやデータ取得フローをここに集約する
    └─ ComponentA.test.ts     # ComponentA に関するテスト（UIとロジック）

- コロケーションの利点: 関連ファイルがまとまっているため、変更範囲が分かりやすく、Agent による自動生成やテスト作成が容易になります。

3) ページ専用のコンポーネントまとめと index.ts の活用
- ページ単位で使うコンポーネント群は `src/components/<route>/index.ts` で名前付きエクスポートし、ページ側でネームスペースインポートします。

  // src/components/route1/index.ts
  // コンポーネントファイルは名前付きエクスポートを前提とする（推奨）
  // 例: ComponentA.tsx に `export const ComponentA = (...)` と定義します。
  export { ComponentA } from "@/components/route1/ComponentA/ComponentA";
  export { ComponentB } from "@/components/route1/ComponentB/ComponentB";

  // app/route1/page.tsx
  // ネームスペースインポート（import * as）を使用
  import * as route1 from '@/components/route1';

  export default function Route1Page() {
    return (
      <>
        <route1.ComponentA />
        <route1.ComponentB />
      </>
    );
  }

4) データフェッチの明確化
- 大きなデータフェッチ（ページ全体のリソース取得）であっても可能な限り機能単位の `*.fetch.tsx` に配置し、ページ（ルーティング）は表示とコンポーネントの組み立てに専念することを推奨します。例外的にページ側で集約フェッチが必要な場合のみ `page.tsx` に置くことを許容します。
- 小さく独立したデータは `ComponentX.fetch.tsx` のようにコンポーネント隣接ファイルで定義し、必要なときに注入して使う。ただし可能な限り props 経由での受け渡しを推奨。
- Server Actions を使って整合性のあるサーバ呼び出しを行うパターンも許容（ただし責務はページ側でまとめること）。

5) 命名とエクスポート方針
- コンポーネントはデフォルトエクスポートせず、名前付きエクスポートを推奨（index.ts で集約した際に扱いやすいため）。
- フォルダ名とファイル名は一致させ、パス解決を簡潔にすること。

6) テストの分離
- UI のテストは ComponentA.tsx に対して行い、ビジネスロジックや fetch はそれぞれのファイルでユニットテストを分ける。これによりテスト設計が簡潔になります。
-   **ディレクトリ名:** ケバブケース (例: `components/personal-information`) を使用します。
-   **ページ固有のデータフェッチ:**
  -   **場所:** 原則として `components/**/*.fetch.tsx` に置き、ページ (`page.tsx` / `layout.tsx`) はフェッチを持たない（表示・組み立て専念）。
  -   **理由:** フェッチをコンポーネント配下に置くことで、機能単位で副作用が完結し、テストやモックが容易になるため。例外的にページレベルで集約が必要なら page に置けますが推奨しません。
-   **コンポーネント固有のデータフェッチ:**
    -   **場所:** `ComponentA.fetch.tsx` のようなデータ取得専用ファイル（または専用 hook）を推奨します。`ComponentA.logic.tsx` はデータの変換や UI に渡すための純粋ロジックを置く目的で使います。
    -   **理由:** データ取得（副作用）を専用ファイルに切り出すことで、テストでのモックや再利用が容易になり、ビジネスロジック（logic）と副作用（fetch）が明確に分離されます。
-   **具体的な構成例:**
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
-   **直感的なデザイン:** ユーザーインターフェースは直感的で使いやすく設計します。
-   **レスポンシブデザイン:** 様々なデバイス (PC、タブレット、スマートフォン) での表示を最適化するため、レスポンシブデザインを採用します。
-   **アニメーションとトランジション:** ユーザー体験を向上させるために、アニメーションやトランジションを適切かつ効果的に使用します。
-   **タグ入力の補完:** 一度入力したタグは、次回入力時に補完されるようにします。

### 3.2. アクセシビリティ
-   **キーボード操作:** 全てのインタラクティブな要素がキーボードのみで操作できるようにします。
-   **ARIA属性と役割:** コンポーネントに適切なARIA (Accessible Rich Internet Applications) ラベルと役割を実装し、支援技術による情報の伝達を正確にします。
-   **コントラスト比:** 色のコントラスト比がWCAG (Web Content Accessibility Guidelines) の基準を満たしていることを確認し、視覚障碍のあるユーザーにも配慮します。

## 4. 採用技術スタックと詳細な活用方針

### 4.1. Next.js と React
-   常に最新バージョンのReactとNext.jsを使用します。
-   Next.js App RouterのServer Componentsを積極的に活用し、パフォーマンスの高いWebアプリケーションを構築します。

### 4.2. Hono (API)
-   APIの実装には、軽量で高速なWebフレームワークであるHonoを使用します。
-   **ルーティング:** シンプルかつ直感的に記述します。
-   **ミドルウェア:** 認証やエラーハンドリングなどの共通処理は、Honoのミドルウェアを活用して効率的に実装します。
-   **型安全性:** TypeScriptの型定義を適切に使用し、型安全なAPI開発を徹底します。
-   **エコシステム活用:** 必要に応じて、Honoの提供するエコシステム (例: `hono/jwt`, `hono/cors`) を活用します。

### 4.3. Next.js サーバーアクション
-   Next.jsのサーバーアクションを積極的に使用します。
-   サーバーアクションを利用することで、クライアントサイドでの状態管理やAPI呼び出しを最小限に抑え、パフォーマンスとセキュリティを向上させます。
-   **入力バリデーション:** 入力データのバリデーションにはZodを使用します。
-   **エラー処理:** 適切なエラー処理を実装し、ユーザーに分かりやすいエラーメッセージを提供します。
-   **戻り値のモデル化:** サーバーアクションの戻り値として、成功時とエラー時の両方のケースを明確にモデル化します。

## 5. ドキュメンテーション

-   **コメント:** 複雑なロジックや理解が難しい箇所には、明確で簡潔なコメントを記述します。
-   **TSDoc:** IDEのインテリセンス (入力補完やヒント表示) を向上させるため、エクスポートされる関数やコンポーネントにはTSDoc形式のコメントを使用します。
-   **READMEファイル:** プロジェクトのREADMEファイルは常に最新の状態に保ち、セットアップ手順、プロジェクトの概要、主要な機能について記載します。
-   **Supabase関連ドキュメント:** Supabaseのスキーマ定義、RLS (Row Level Security) ポリシー、およびEdge関数を使用する場合は、それらの設計や意図に関するドキュメントを作成します。

---
