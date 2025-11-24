import Link from 'next/link';

export const metadata = { title: 'マッチング — masakinihirota' };

export default function MatchingPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">マッチング</h1>
            <p className="mb-4">価値観や作品の評価をもとに、似た価値観のユーザーを見つけるための機能やフローを紹介するページです。</p>
            <p className="mb-4">自動・手動のマッチングや、その条件についての説明（予定）を掲載します。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
