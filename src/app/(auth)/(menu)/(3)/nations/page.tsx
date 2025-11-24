import Link from 'next/link';

export const metadata = { title: '国（トップダウン） — masakinihirota' };

export default function NationsPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">国（トップダウン）</h1>
            <p className="mb-4">大規模コミュニティ（国）についての説明ページです。建国の流れやルール、ポイント徴収ルールなどの概要を掲載します。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
