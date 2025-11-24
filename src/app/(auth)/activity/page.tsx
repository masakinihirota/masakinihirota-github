import Link from 'next/link';

export const metadata = { title: 'アクティビティ — masakinihirota' };

export default function ActivityPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">アクティビティ</h1>
            <p className="mb-4">最近の活動履歴やポイント変動などを表示する場所です（静的プレースホルダ）。</p>
            <nav className="mt-6">
                <Link href="/home">ホームへ戻る</Link>
            </nav>
        </div>
    );
}
