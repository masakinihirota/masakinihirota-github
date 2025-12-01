# main ブランチとの差分レビュー — dev ブランチの変更点サマリ

対象: dev ブランチで main と差分のある変更ファイルをレビューしました。
重点対象: RBAC 実装とテスト、最小 DB テスト、関連シード／定数、playground の UI 変更、設計ドキュメント。

以下は重要度順に並べた指摘（致命的 > 重大 > 注意 > 軽微）と、影響範囲・再現手順・期待動作・修正提案です。

---

## 重大 (High / Major)

1) RBAC: 例外 (exception grants) と profile の解決が未実装 — 認可処理の脆弱性につながる可能性

- ファイル: `src/services/rbac.service.ts`
- 参考行: 31-41 (例外の取得)、58-65 (コンテキスト / nation の未実装)
- 内容・影響範囲: hasPermission は例外(allow/deny)を優先する旨のコメントがあるが、profileId の解決や deny/allow の判定ロジックが未実装のまま。現状では例外が考慮されず、deny が適切に阻止されない/allow を見逃すなどセキュリティ不整合が発生する可能性が高い。
- 再現手順:
  1. DB に role を付与したユーザーを用意
  2. 同じ permission に対して `aclExceptionGrants` に deny (profile) を登録
  3. hasPermission を呼び出す
  4. 期待: deny が優先され false を返す -> 実際: deny が無視される可能性がある
- 期待される挙動: 例外 (明示的な deny) は最優先で評価され、deny の場合には false を返す。allow の例外は deny が無い場合に true を返す
- 修正案:
  - `userId` から該当 profileId (active profile(s)) を解決する処理を追加する。実装案: users -> rootAccounts -> profiles を辿る、または profileId が与えられる API を用意
  - `aclExceptionGrants` を読み、deny があるか先にチェック、次に allow をチェックするロジックを実装
  - `hasPermission` に profileId を引数として受け取るオーバーロード (テストしやすさ向上)
  - 明示的なユニットテスト（deny override、allow override）を追加

2) テストの DB cleanup / 独立性の不足 — テスト実行で DB 状態が汚染される恐れ

- ファイル: `src/services/rbac.service.test.ts` (beforeEach/afterEach)
- 参考行: 13-34 (insert setup), 36-40 (cleanup)
- 内容・影響範囲: beforeEach で `aclPermissions` と `aclRoles` を insert しているが、afterEach では `users` と `userSystemRoles` のみ削除。テストが何度も実行される（CI・ローカル）と DB にゴミが残る/他テストに影響する可能性あり。
- 再現手順: テストを複数回反復実行、または並列実行するとテスト間で状態干渉が起きる
- 期待される挙動: 各テストは副作用を残さない(または明確に teardown する)、または各テストをトランザクションでロールバックする
- 修正案:
  - afterEach で insert した `aclPermissions`, `aclRoles`, `aclRolePermissions` を削除してデータを元に戻す
  - もしくは、テスト向けに DB トランザクション + ロールバックで隔離する仕組みを導入
  - 名前衝突を避けるため、一意のID (ランダム) をテスト挿入に使う／cleanup を確実に行う

---

## 注意 (Medium)

1) `src/services/minimal.test.ts` — cleanup の where 条件が間違っている（drizzle の eq を使うべき）

- ファイル: `src/services/minimal.test.ts`
- 参考行: 17-19
- 問題: cleanup で `db.delete(users).where(users.id === id)` と JS 演算子を使っている (`===`)。drizzle ORM の条件は `eq(users.id, id)` のように `eq` を用いる必要があるため、この行は機能しない可能性が高い。
- 影響: テストでユーザーが削除されず DB 汚染 -> テストが不安定になる
- 修正案: `await db.delete(users).where(eq(users.id, id))` に変更

2) `src/services/rbac.service.ts` — 未使用 / 欠けている実装と型の改善

- ファイル: `src/services/rbac.service.ts`
- 参考行: 14 (imports), 74 (checkRolesForPermission signature)
- 問点: `sql` はインポートされているが未使用（軽微）; `checkRolesForPermission` の `permissionId` パラメータは `string` 型で宣言されているが、プロジェクトでは `AclPermission` 型が導入済み（型の一貫性を保つべき）。
- 修正案: 未使用のインポートを削除、引数を `AclPermission` 型に統一

3) seeds: `src/db/seeds/rbac.ts` — ROLE_DEFINITIONS の有無チェックがない

- 参考行: シード中の ROLE_DEFINITIONS[roleId] の参照
- 問題: `ROLE_DEFINITIONS` に該当エントリがない場合に例外を投げる可能性
- 修正案: seed 時に `def` が存在するか検査し、未定義ならログを出してスキップ

---

## 軽微 (Low / Minor)

1) `src/constants/rbac.ts` — ROLE_DEFINITIONS の一部矛盾の可能性

- ファイル: `src/constants/rbac.ts`
- 参考: `GENERAL_USER` の `scope` が `system` だが nation/org 系 permission を多数持っている行
- 内容: 意図した設計か確認が必要（設計仕様上の決定であれば問題ないが、整合性チェックを追加することを推奨）

2) UI: `src/app/playground/privacy-demo/page.tsx` — 固定の「最終更新日: 2024年12月31日」が古い
- 参考行: `page.tsx` の最上部の日付表示
- 提案: 動的にビルド日時を表示するか、日付を 2025 へ更新

3) コード品質: 使われていない imports（例: `sql`）や TODO コメントが残っている箇所は linter/CI で指摘される可能性あり

---

## 欠落テスト（重要）

- `rbac.service` の以下振る舞いに対する unit / integration テストが不足しています。
  1. 例外 (aclExceptionGrants) の deny/allow 優先度に関するテスト（必須）
  2. nation / organization コンテキストでの role 解決ロジックのテスト
  3. assignNationRole の期待される動作（存在しない profile/nation への割付時の挙動）
  4. seeds の idempotency と ROLE_DEFINITIONS のカバレッジ検証

テストの例（簡潔）:
  - scenario: ユーザーが sys_admin ロールを持ち、permission が付与されているが profile に対して明示的な deny がある → hasPermission は false を返す
  - scenario: nation コンテキストで nation_leader role を持つ profile が与えられている → hasPermission は該当 nation コンテキストで true を返す

---

## まとめ & 優先対応案（短期）

1. 最高優先: `src/services/rbac.service.ts` の例外処理ロジックを正しく実装し、`userId -> profileId` の解決を行う（ユニットテストを必ず追加）
2. テスト信頼性向上: `rbac.service.test.ts` の teardown を拡充するかテスト DB の隔離を導入
3. `minimal.test.ts` の cleanup バグを修正し、簡潔な assertion を追加
4. seeds の堅牢化（ROLE_DEFINITIONS の存在チェック）と、RBAC 例外/コンテキストのテストカバレッジを拡充

---

もしよろしければ、私の次のアクションとしてこれらの優先度高い修正点のどれを先に自動で修正／テスト追加するか指定してください。優先度順に PR 用の patch を準備して適用します。
