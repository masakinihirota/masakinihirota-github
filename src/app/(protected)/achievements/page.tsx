import Link from 'next/link'

export const metadata = { title: '実績 / アチーブメント — masakinihirota' }

export default function AchievementsPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">実績 / アチーブメント</h1>
            <p className="mb-4">ユーザーのバッジ、ポイント履歴、達成状況のプレースホルダ。</p>
            <nav className="mt-6">
                <Link href="/home">ホームへ戻る</Link>
            </nav>
        </div>
    )
}
