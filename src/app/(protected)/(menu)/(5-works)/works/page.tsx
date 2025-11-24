import Link from 'next/link';

export const metadata = { title: '作品登録 — masakinihirota' };

export default function WorksPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">作品登録</h1>
            <p className="mb-4">作品を登録してプロフィールと紐付けることで、マッチングやチェーン機能に活用できます。</p>
            <p>このページは静的な説明ページ（実装は段階的に追加）です。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
