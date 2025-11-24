import Link from "next/link";

export default function HelpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-2xl text-center">
                <h1 className="text-xl font-semibold mb-3">説明ページ（Help）</h1>
                <p className="text-zinc-600 mb-6">サービスの簡単な説明と静的なヘルプ情報。</p>
                <Link href="/">← ランディングに戻る</Link>
            </main>
        </div>
    );
}
