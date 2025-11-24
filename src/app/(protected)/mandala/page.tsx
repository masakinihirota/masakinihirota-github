import Link from 'next/link'

export const metadata = { title: 'マンダラチャート — masakinihirota' }

export default function MandalaPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">マンダラチャート</h1>
            <p className="mb-4">目標やスキルを可視化するマンダラチャートのプレースホルダ。</p>
            <nav className="mt-6">
                <Link href="/home">ホームへ戻る</Link>
            </nav>
        </div>
    )
}
