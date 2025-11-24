import Link from 'next/link';

export const metadata = { title: '組織 — masakinihirota' };

export default function OrganizationsPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">組織（ボトムアップ）</h1>
            <p className="mb-4">価値観をベースにした小規模組織の作成や参加、運営方針の説明を行う静的ページです。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
