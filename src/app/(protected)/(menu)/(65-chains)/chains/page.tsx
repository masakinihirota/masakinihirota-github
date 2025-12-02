import Link from 'next/link'

export const metadata = { title: 'チェーン（Chain） — masakinihirota' }

export default function ChainPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">チェーン（作品・話題のつながり）</h1>
            <p className="mb-4">作品や話題をチェーン（連鎖）で紐づけて閲覧するページのプレースホルダ。</p>
            <nav className="mt-6">
                <Link href="/home">ホームへ戻る</Link>
            </nav>
        </div>
    )
}
