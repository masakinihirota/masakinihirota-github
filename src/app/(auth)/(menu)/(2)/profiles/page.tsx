import Link from 'next/link';

export const metadata = { title: '千の仮面（プロフィール） — masakinihirota' };

export default function ProfilesPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">千の仮面 — プロフィール</h1>
            <p className="mb-4">このページはユーザーが複数のプロフィール（千の仮面）を作る概念の紹介ページです。</p>
            <p className="mb-4">機能や制限（匿名 / OAuth など）に関する説明を追加予定です。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
