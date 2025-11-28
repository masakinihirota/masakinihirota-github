import Link from 'next/link';

export const metadata = { title: 'メッセージ — masakinihirota' };

export default function MessagesPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">メッセージ</h1>
            <p className="mb-4">個別メッセージやウォッチ一覧（静的プレースホルダ）。</p>
            <nav className="mt-6">
                <Link href="/home">ホームへ戻る</Link>
            </nav>
        </div>
    );
}
