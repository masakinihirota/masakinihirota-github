ご指定のURL（`https://postd.cc/react-server-components-are-breaking-production-apps-and-nobodys-talking-about-it/`）の記事の内容をMarkdown形式で要約して表示します。

-----

# React Server Components (RSC) の本番運用上の課題について

この記事は、React Server Components（RSC）が本番環境のアプリケーションで引き起こしている、あまり議論されていない重大な問題点に焦点を当てています。

## 主な問題点

### 問題点 1：Client Component内でのServer Componentの利用制約 (断片的な情報に基づく推測)

（※記事の要約の先頭が切り詰められていたため、推測に基づきますが、）Client Component内でServer Componentを直接インポート・利用しようとすると、以下の問題に直面します。

  * コンポーネントの**カプセル化**が失われる。
  * **関心の分離**が損なわれる。
  * Server Componentsの設計目的が達成できない。

### 問題点 2：キャッシュというブラックボックス

React 19とNext.js 14以降に導入された積極的なキャッシュ機構が、本番環境で予期せぬバグを引き起こすことがあります。

**遭遇した実際のバグの例:**

1.  ユーザーが新しい投稿を作成し、`/posts`にリダイレクトされる。
2.  新しい投稿がリストに表示されない。
3.  リロードやブラウザーキャッシュのクリアを試みても効果がない。

**原因:**

Next.jsがサーバー上でデータベースのクエリ結果をキャッシュしており、新しい投稿が作成された際にそのキャッシュを適切に無効化（invalidate）していなかったためです。

**解決策とトレードオフ:**

`export const revalidate = 0`を設定してキャッシュを無効化することで解決できますが、これによりパフォーマンス上の利点が失われ、ページロードごとにデータベースアクセスが走り、Client Componentsを使っていた頃のパフォーマンスに逆戻りしてしまいます。

**より深刻な問題:**

何がキャッシュされているのかを確認するツール（キャッシュインスペクターなど）がないため、開発者は推測に頼らざるを得ません。

### 問題点 3：クライアントとサーバーの境界が分かりにくい

`'use client'`ディレクティブを使うと、そのコンポーネントツリー配下は全てClient Componentでなければならないというルールが、直感に反し、開発を難しくしています。

**誤ったコードの例:**

```tsx
// ❌ This looks like it should work
'use client'
import { ServerComponent } from './ServerComponent'

export default function ClientComponent() {
  // ... state logic
  return (
    <div>
      {/* ... */}
      <ServerComponent /> {/* Error! */}
    </div>
  )
}
```

**正しい修正方法（Server Componentを`children`として渡す）:**

Server ComponentをClient Componentにインポートする代わりに、親のServer Componentから`children`として渡す必要があります。

```tsx
// ✅ Pass Server Component as children
// Client Component
'use client'
export default function ClientComponent({ children }) {
  // ... state logic
  return (
    <div>
      {/* ... */}
      {children}
    </div>
  )
}

// Parent (Server Component)
<ClientComponent>
  <ServerComponent />
</ClientComponent>
```

このパターンは直感的でなく、経験の浅い開発者にとって大きな障害となっています。

### 問題点 4：フォームの複雑性

従来のREST APIベースのフォーム処理と比較して、RSCのServer Actionsによるフォーム処理は複雑さが増します。

**従来のシンプルさ:**

```tsx
'use client'
export default function Form() {
  async function handleSubmit(e) {
    e.preventDefault()
    // ... fetch API call ...
    if (res.ok) router.push('/success')
  }
  return <form onSubmit={handleSubmit}>...</form>
}
```

**Server Actionsによる複雑化:**

Server Actionsでは、エラーハンドリング、ローディング状態の表示、クライアントサイドのバリデーションなどに、追加のファイルや新しいフック（`useFormStatus`）が必要になります。

**例：ローディング状態の表示:**

ローディング状態を表示するためだけに、`'use client'`を持つ別のコンポーネントと、`useFormStatus`フックが必要になります。

```tsx
// Client Component
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

export default function Form() {
  return (
    <form action={submitForm}>
      {/* ... */}
      <SubmitButton />
    </form>
  )
}
```

これにより、以前の方法のシンプルさと比べて、ファイル数と複雑さが増加します。

### 問題点 5：TypeScriptの型安全性が失われる

Server Componentsは、propsをJSONにシリアライズする際、TypeScriptの型システムを巧妙に「破壊」します。

**問題の例:**

データベースから取得した`Date`オブジェクト（Prismaの型）をServer ComponentからClient Componentに渡すと、JSONシリアライズによって`Date`オブジェクトが単なる**文字列**に変換されます。

```tsx
// lib/db.ts
export async function getUser() { /* ... db call ... */ }

// app/page.tsx - Server Component
export default async function Page() {
  const user = await getUser()
  return <UserProfile user={user} /> // userはシリアライズされる
}

// components/UserProfile.tsx - Client Component
'use client'
interface Props {
  user: User // Prisma type with Date objectsと認識される
}
export default function UserProfile({ user }: Props) {
  // TypeScriptはDateオブジェクトだと信じているが...
  return <div>{user.createdAt.toISOString()}</div> // Runtime error! (文字列にはtoISOStringがないため)
}
```

TypeScriptはこれを型エラーとして検知できず、本番環境でのみランタイムエラーが発生します。

**修正策:**

データベース呼び出しごとに、`Date`オブジェクトを手動で`toISOString()`などで文字列に変換するシリアライズ関数を記述する必要があります。これにより、サーバー用とクライアント用で別々の型定義が必要になり、安全性を確保するためのランタイムチェックも必要になります。

-----

## Server Componentsがうまく機能するケース

Server Componentsが真価を発揮する特定のユースケースもあります。

### ✅ ユースケース 1：静的コンテンツサイト

ブログの投稿ページなど、**インタラクティビティーが不要**で、コンテンツの変更がまれなサイト。キャッシュに最適で、SEOにも強いです。

### ✅ ユースケース 2：ダッシュボードのレイアウト

すべてのページでユーザーデータが必要な場合など、レイアウト部分の**インタラクティビティーが最小限**で、ユーザーセッションをキャッシュできる場合に適しています。

### ✅ ユースケース 3：データテーブル（フィルターなし）

表示専用のデータで、クライアントサイドの**stateが不要**な場合。サーバーサイドレンダリングの方が高速です。

-----

## Server Componentsが失敗するケース

### ❌ アンチパターン 1：リアルタイム更新

WebSocketなどを利用して頻繁に更新をサブスクライブする必要がある「ライブフィード」のような機能。更新をサブスクライブするにはClient Componentが必須です。

### ❌ アンチパターン 2：複雑なフォーム

複数ステップのフォームや、送信前の複雑なクライアントサイドバリデーションが必要なフォーム。フォームのstate管理が複雑になり、Server Actionsとクライアントのstateを混ぜることで混乱が生じます。

### ❌ アンチパターン 3：インタラクティブ性の高いUI

カラムのソート、行のフィルタリング、アイテムの選択、ページネーションなど、ユーザー操作によって頻繁にUIが変化するデータグリッドのようなコンポーネント。これらの機能にはClient Componentが必要です。
