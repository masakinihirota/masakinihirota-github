import Link from 'next/link';

export const metadata = { title: 'このサービスについて — masakinihirota' };

export default function AboutPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">masakinihirota について</h1>
            <p className="mb-4">
                VNS（Value Network Service）を実現するためのプロジェクトです。価値観を軸に人とつながる、新しいタイプのネットワークサービスを目指します。
            </p>
            <p className="mb-4">このページは全体要件定義書にあるサービス概要を簡潔に紹介する静的ページです。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
