# main ブランチとの差分レビュー（dev ブランチ）

日付: 2025-11-30
対象ブランチ: dev (origin/dev)  — 比較先: origin/main

概要: dev で加えられた変更のうち、重点的に確認したファイルは以下です。
- src/services/rbac.service.ts
- src/services/rbac.service.test.ts
- src/services/minimal.test.ts
- src/db/seeds/rbac.ts
- src/constants/rbac.ts
- src/app/playground/privacy-demo/page.tsx などドキュメント的変更

レビューは「潜在的なバグ・仕様逸脱・動作退行・パフォーマンスやセキュリティ影響」を優先度順に記載しています。再現手順・期待挙動・修正提案・不足テストの例を添えています。

---

## 重要（High / Major）

1) 例外 (acl_exception_grants) の検出・優先順位処理を実装したが、ユーザーごとに持つ profile 解決の責務が曖昧

- 該当: `src/services/rbac.service.ts` (おおよそ 31-56 行、33-44 行に例外と profile 解決のロジック)
- 概要/影響: dev で hasPermission に profile 解決（users -> root_accounts -> profiles）を追加し、profile に紐づく acl_exception_grants を読み取り deny/allow を判定しています。これは正しい方向ですが、実装は "ユーザーが複数 profile を持つ" 場合の扱い、profiles の状態（active/expired など）や例外のスコープ (resourceType/resourceId/期限) を考慮していません。短期的には期待どおり動きますが、将来的には例外スコープや期限、profile 活性状態によって誤判断を招く可能性があります。
- 再現手順: profile が複数あるユーザーを用意し、それぞれに conflicting exception (一方 deny 他方 allow) を挿入し hasPermission を呼ぶ（期待: deny があれば最優先で false）。現状の実装は deny があれば false が返るため「deny wins」は満たしますが、シナリオでの「どの profile が優先されるべきか（active profile のみ）」の扱いは未定義。
- 期待される挙動: - 明示的 deny が検出されたら false - それ以外で allow があれば true - permission に resource scope (resourceId, resourceType) や expiresAt がある場合、それらの条件を考慮
- 修正案: profile のフィルタリング（active 状態）を実装／コメント追加、aclExceptionGrants の resourceType/resourceId/expiresAt を尊重する条件を加える。さらに、hasPermission に profileId を直接渡せるオーバーロードを追加して明示的解決を可能にする。
- テスト: 追加済みテストが deny/allow をカバーしていますが、期限切れ例外、resource-scoped例外、複数 profiles の衝突ケースを追加する必要があります。

2) テストデータの再利用（同一 `testUserId`）は不安定化の原因になりうる

- 該当: `src/services/rbac.service.test.ts`（先頭で `const testUserId = randomUUID()` を describe スコープで生成）
- 概要/影響: テストは beforeEach で `db.insert(users)`、afterEach で `db.delete(users)` を実施する設計です。describe スコープで1つの `testUserId` を使い回しているため、テストが並列実行されるか途中で失敗した場合、別テストの状態を破壊する可能性があります。単体実行・直列実行では問題になりにくいですが、テストランナーが並列化したり、開発者が別スクリプトで同一 DB を操作するとフレークが発生します。
- 再現手順: テストを並列実行/並列ワーカーを有効化してみる（vitest はデフォルトで並列実行の可能性あり）。競合が起きると INSERT でユニーク制約（email）や DELETE で影響が発生する。
- 期待される挙動: 各 it ブロックごとに独立したテストデータを用いる（user id を beforeEach で生成、もしくはトランザクションで rollback）
- 修正案: beforeEach 内で per-test の userId を生成して確実にテスト毎に unique なユーザを用いる。または、DB トランザクションで各テストをラップして rollback する仕組みを導入。
- テスト: 現在の修正は部分的に isolation を加えていますが、`testUserId` を beforeEach 内で生成するよう変更するテストケースを追加推奨。

---

## 注意（Medium）

1) organization / nation コンテキストチェックは追加されたが、検索テーブルの整合性と名前の取り違えの可能性

- 該当: `src/services/rbac.service.ts`（context の nationId / organizationId 判定ブロック、約 86-106 行）
- 概要/影響: nation の割当は `aclNationRoleAssignments` でチェックし、organization の割当は `organizationMembers` でチェックするように修正されています。実装としては妥当ですが、organization ロールを保存するスキーマが将来変更された場合（roleId キー名など）にバグが入りやすいこと、organization の権限は `aclRolePermissions` へ正しくマッピングされているか（roleKey と id の一貫性）が運用上重要です。
- 期待される挙動: 両方のコンテキストで profile → role → permission の流れが正しく評価されること
- 修正案: 追加の単体テストで nation と organization の両方のフローを網羅し、roleId／roleKey の不整合がないか確認する。将来のスキーマ変更に備えて、実装に対して contract テスト（schema shape のアサーション）を用意すると安全。

2) `checkRolesForPermission` のパフォーマンス・SQL生成に注意

- 該当: `src/services/rbac.service.ts` (`checkRolesForPermission` の where inArray クエリ)
- 概要/影響: inArray に長い roleId 配列を渡すと SQL IN 句が巨大になる可能性ある。規模が小さい現在のデータでは問題ないが、キャッシュや computed permission の導入を検討すべき。パフォーマンス劣化があり得る。
- 修正案: 将来的に roleIds の配列長に制限する、または join を使った単一クエリや db.exists 相当のクエリに置き換える。DB 側でインデックスや制約を適切に維持すること。

---

## 軽微（Low/Minor）

1) DB カラム名／戻り値のキー名 (snake_case/camelCase) の扱い

- 該当: `src/services/rbac.service.ts` の exceptions チェック部（isDeny のプロパティ参照など）
- 概要/影響: Drizzle や Postgres の設定で返されるオブジェクトのキーが snake_case になることがあるため、コード内で `e.isDeny` を参照している箇所は、環境によっては `e.is_deny` になる可能性があります（現時点ではプロジェクト全体で camelCase が用いられているように見えるため問題は限定的）。
- 修正案: 明示的にフィールド名を alias/cast などで統一するか、テストで検証しておく。

2) misc: `src/app/playground/privacy-demo/page.tsx` の固定日付更新はドキュメント的改善（minor）

---

## 欠落しているテスト（要追加）

1. RBAC の例外に関する追加ケース
   - resource-scoped exception（resourceType/resourceId が与えられたケース）
   - expiresAt による有効期限切れの扱い
   - 複数 profile がある場合の衝突（複数 profile に conflicting exception がある場合の挙動）

2. nation コンテキストの完全検証
   - aclNationRoleAssignments を使った nation コンテキストのテスト（現在は org コンテキストと deny/allow のテストはあるが、nation の E2E は未カバー）

3. テスト隔離/並列実行ケース
   - テストを並列ワーカーで実行した場合に干渉が起きないことを保証するためのトランザクション/ロールバックの導入テスト

---

## 修正優先度（短期推奨順）

1. テストの並列実行・隔離対策（beforeEach でユニーク userId を生成する / トランザクションラップを導入） — テスト信頼性向上のため最優先
2. RBAC: 例外スコープ (resource, expiresAt) と複数 profile のルールを明文化 & テスト追加 — セキュリティ上の重要度が高い
3. nation コンテキストの追加ユニットテストを作成（実装があるがテスト不足）
4. パフォーマンス改善（checkRolesForPermission を JOIN/exists パターンに変更） — 規模拡大時の対策

---

必要であれば、上記優先度の自動修正パッチ（例: テスト isolation を導入するコード + テスト修正、nation のテスト追加）を私が作成して適用します。どれを先に直しますか？
