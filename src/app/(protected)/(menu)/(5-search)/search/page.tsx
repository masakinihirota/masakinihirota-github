/**
 * 認証済みユーザー向け検索ページ
 * サイドバーメニュー付きで表示される
 *
 * 公開検索ページ (/search) と同じ機能を提供しますが、
 * (protected) レイアウト内にあるためサイドバーが表示されます
 */
import React from 'react'
import Link from 'next/link'
import { searchContent } from '@/app/search/_actions/searchContent'
import ResultsList from '@/app/search/_components/ResultsList'

export default async function ProtectedSearchPage({
    searchParams,
}: {
    searchParams?: Promise<{ q?: string; scope?: string } | undefined>
}) {
    const resolved = searchParams ? await searchParams : undefined
    const q = resolved?.q?.toString() ?? ''
    const scope = resolved?.scope?.toString() ?? 'works'

    if (!q) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-semibold">検索</h1>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                    クエリを入力して作品（Works）を検索してください。ヘッダーからのクイック検索からもここに遷移します。
                </p>
                <div className="mt-6">
                    <h2 className="text-lg font-medium">人気の作品</h2>
                    <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                        人気の作品をここに表示する予定です（未実装）。
                    </div>
                </div>
            </div>
        )
    }

    try {
        // For MVP we only support works scope server search
        if (scope !== 'works' && scope !== 'all') {
            return (
                <div className="max-w-4xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold">検索 - {scope}</h1>
                    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                        現在このスコープはサポートされていません。まずは Works を検索してください。
                    </p>
                </div>
            )
        }

        const rows = await searchContent({ q, scope })

        if (!rows || rows.length === 0) {
            return (
                <div className="max-w-4xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold">「{q}」の検索結果</h1>
                    <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
                        結果は見つかりませんでした。
                    </div>
                    <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                        候補: スコープを{' '}
                        <Link href={`/search?q=${encodeURIComponent(q)}&scope=all`} className="text-blue-600 hover:underline">
                            All
                        </Link>{' '}
                        にして検索するか、キーワードを変えてみてください。
                    </div>
                </div>
            )
        }

        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-semibold">「{q}」の検索結果</h1>
                <ResultsList rows={rows} />
            </div>
        )
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-semibold">検索エラー</h1>
                <div className="mt-4 text-sm text-red-600">{msg}</div>
            </div>
        )
    }
}
