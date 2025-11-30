# TDD テスト計画とコロケーション方針

この文書は、VNS masakinihirota の実装で徹底すべきテスト戦略（TDD）と、テストをどのようにコロケーションするかの実践ガイドです。

---

## 基本方針

- すべての新規実装はまず失敗するテストを作成し、最小実装で通す（RED → GREEN → REFACTOR）。
- テストは可読性を重視し、受け入れ基準がそのままテストケースになるように記述する。

## テストの種類と配置

1. ユニットテスト（最小の単位）
   - コンポーネント内部の純粋なロジックや関数を検証。
   - 位置: 同ディレクトリに `*.test.ts` / `*.test.tsx` を置く。

2. コンポーネントテスト（UI レンダリング）
   - React Testing Library を使って、ユーザーが見る振る舞いを検証。
   - 位置: コンポーネント隣接 `Component.test.tsx`。

3. 統合テスト（API と少数のコンポーネント）
   - ローカル Supabase を使うテストは `tests/integration/` にまとめる。
   - DB 状態セットアップ用の fixture を用意する。

4. E2E（必要時）
   - しっかりしたユーザーシナリオを検証するが、まずは単体と統合で品質を担保する。

---

## テストテンプレート（例）

1) コンポーネントのテストテンプレート (Vitest + React Testing Library)

```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExampleComponent from './ExampleComponent'

describe('ExampleComponent', () => {
  it('レイアウトが表示される', () => {
    render(<ExampleComponent />)
    expect(screen.getByText('Example')).toBeDefined()
  })
})
```

2) ユニットテスト（ビジネスロジック）

```ts
import { addPoints } from './points'
import { it, expect } from 'vitest'

it('ポイントを正しく加算する', () => {
  expect(addPoints(5, 3)).toBe(8)
})
```

3) DB 統合テスト（ローカル Supabase 用）

- テストは `tests/integration/` に置く
- テスト実行前にローカル Supabase の起動手順（README に記載）を必ず実施

```ts
// pseudo: setup a local connection, apply fixtures, run query assertions
```

---

## チェックリスト（新機能を作る際）

1. 受け入れ基準を書いた
2. 失敗するテストを作成した
3. 実装を行いテストを通した
4. 余分な依存を精査し、テストが壊れないようにリファクタした
5. ドキュメントを更新した

---

必要なら、具体的な `vitest` config、eslint 設定、サンプル fixtures を自動生成して追加できます。次はこの設計を踏まえた最初の実装タスク（認証）を TDD で作る提案を行います。
