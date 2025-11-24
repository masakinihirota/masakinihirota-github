import Link from 'next/link';

export const metadata = { title: 'オアシス宣言 — masakinihirota' };

export default function OasisPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">オアシス宣言</h1>
            <p className="mb-4">VNS のコミュニティ運営の基本理念「オアシス宣言」の全文と要点を掲載する静的ページです。</p>
            <ul className="list-disc pl-6">
                <li>インターネット上で翼を休める場所を作る</li>
                <li>広告はユーザー側に主導権がある</li>
                <li>共通の価値観を持った人が集まるオアシスを作る</li>
                <li>誰もが参加できるが、優しい世界を守る</li>
            </ul>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    );
}
