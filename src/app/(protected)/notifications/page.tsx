import Link from 'next/link';

export const metadata = { title: '通知 — masakinihirota' };

export default function NotificationsPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">通知</h1>
            <p className="mb-4">通知一覧やイベントの要約が表示されます（静的プレースホルダ）。</p>
            <nav className="mt-6">
                <Link href="/home">ホームへ戻る</Link>
            </nav>
        </div>
    );
}
