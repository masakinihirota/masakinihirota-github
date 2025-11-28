"use client"

import Link from 'next/link'

export const metadata = { title: 'Playground — UI Samples' }

const samples = [
    { id: 'home', title: 'HOME（ホーム画面）' },
    { id: 'root-account', title: 'ルートアカウント画面' },
    { id: 'profile', title: 'ユーザープロフィール画面' },
    { id: 'works', title: '作品一覧画面' },
    { id: 'work-detail', title: '作品詳細画面' },
    { id: 'work-new', title: '作品登録画面' },
    { id: 'organizations', title: '組織一覧画面' },
    { id: 'nations', title: '国一覧画面' },
    { id: 'matching-settings', title: 'マッチング設定画面' },
    { id: 'search', title: '検索画面' },
    { id: 'settings', title: '設定画面' },
    { id: 'oasis', title: 'オアシス宣言ページ' },
    { id: 'terms', title: '利用規約ページ' },
]

export default function PlaygroundIndex() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Playground — UI サンプル集</h1>
            <p className="text-sm text-muted-foreground mb-6">このディレクトリは Supabase 形式のダミーデータを使った独立ページのプレイグラウンドです。</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {samples.map(s => (
                    <li key={s.id} className="border rounded-lg p-4 hover:shadow">
                        <Link href={`/playground-github-copilot/${s.id}`} className="block">
                            <div className="text-lg font-semibold">{s.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">独立したページとして開きます（ダミーデータ使用）</div>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="mt-8 text-xs text-muted-foreground">位置: <code>src/app/playground-github-copilot/</code></div>
        </div>
    )
}
