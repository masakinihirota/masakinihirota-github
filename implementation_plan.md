# 実装計画 (implementation_plan.md)

更新日: 2025-12-03

この文書は「masakinihirota」プロジェクトの実装を進めるための実践的な計画書です。
設計リポジトリ内の要件定義書／設計書を基に、MVP 実装の優先順位、フェーズ分割、テスト指針 (TDD)、コロケーション方針を明確化します。

---

## 📊 現状サマリー

### 完了済み機能
| カテゴリ | 状況 | 詳細 |
|---------|------|------|
| 認証基盤 | ✅ 完了 | Supabase OAuth (Google)、middleware.ts 設定 |
| プロフィール | ✅ 完了 | 表示/編集 UI、CRUD API、テスト |
| コミュニティ | ✅ 完了 | 組織作成/一覧 CRUD API |
| ポイント経済 | ✅ 完了 | 履歴取得、トランザクション、残高バリデーション |
| RBAC基盤 | ✅ 完了 | acl_* スキーマ、computeMergedPermissions |
| 管理者UI | ✅ 完了 | スケルトン (dashboard/users/contents/penalties/system) |
| HONO API | ✅ 完了 | REST API 全エンドポイント (/api/v1/*) |
| UIコンポーネント | ✅ 完了 | 90以上のページ、152テストファイル |

### テスト状況
- **Test Files**: 152 passed | 11 skipped (163)
- **Tests**: 448 passed
- **Coverage**: 単体テスト完備、DB統合テストはローカル実行

---

## 要約（目的） ✅

- 早期に価値を提供できる MVP を TDD で実装する
- 最小限の機能を短いイテレーションでデリバリする
- 価値観ベースのマッチングを核とした「国・組織・プロフィール」の連携を実現

---

## リリースフェーズ（高レベル） 📦

### フェーズ 0 — 準備（✅ 完了）
- 開発環境の標準化（ローカル Supabase）
- TDD 用テンプレート (Vitest) 整備

### フェーズ 1 — コア MVP（✅ 完了）
- ユーザ登録 / ログイン（Google OAuth）
- プロフィールの基本表示/編集
- コミュニティ（組織）の作成と表示

### フェーズ 2 — ポイント経済（✅ 完了）
- ポイント付与/消費の最小限フロー
- トランザクション整合性確認

### フェーズ 3 — 管理者機能・RBAC（🔄 進行中）
- [x] 管理者用ページスケルトン
- [x] RBAC 基盤（computeMergedPermissions）
- [ ] **管理者ロールチェック middleware 実装**
- [ ] Server Component での二重チェック

### フェーズ 4 — 機能拡張（📋 計画中）
- 作品評価機能の強化（ティア、スキ/拍手）
- マッチング機能強化（スコア計算、自動候補）
- 国機能（建国、常駐管理）

### フェーズ 5 — 非機能・横断（📋 計画中）
- RLS ポリシー本番適用
- パフォーマンス最適化
- UI/UX 改善

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Frontend | Next.js 15.5.6 (App Router) |
| UI | Tailwind CSS v4, Shadcn/UI |
| Database | PostgreSQL (Supabase Local) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (Google OAuth) |
| API | HONO 4.10.7 + Zod Validator |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel (予定) |

---

## TDD とコロケーション方針（必須）🧪

- 全ての新規 UI コンポーネント / ビジネスロジックはテストファーストで作成
- RED → GREEN → REFACTOR サイクルを厳守
- コンポーネント単位で近くにテストファイルを配置
  - 例: `Component.tsx` と同ディレクトリに `Component.test.tsx`

---

## 次のアクション（短期）▶️

### 優先度: 高
1. **Task 5.3**: 管理者ロールチェック middleware 実装
   - `/admin` 配下のRBAC検証
   - 非管理者の `/home` リダイレクト

### 優先度: 中
2. **Task 7.1-7.3**: 作品評価機能強化
3. **Task 8.1-8.3**: マッチング機能強化

### 優先度: 低
4. **Task 10.1**: RLS ポリシー本番適用
5. **Task 12.1-12.3**: UI/UX 改善

---

## セキュリティ・運用注意点 🔒

- OAuth シークレットや DB 接続情報は `.env` で管理（リポジトリ含めない）
- RLS / RBAC の設計は早期に検討（段階的に実装）
- 管理者権限は middleware + Server Component で二重チェック

---

## 参照ドキュメント

- `tasks.md` — 詳細タスクリスト
- `vns-masakinihirota-design/` — 設計書・要件定義書
- `docs/` — 機能別ドキュメント

---

質問や優先事項の変更があれば教えてください — 計画を調整します。
