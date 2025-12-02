import Link from "next/link";

export default function HelpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-2xl text-center">
                <h1 className="text-xl font-semibold mb-3">ヘルプセンター</h1>
                <p className="text-zinc-600 mb-6">サービスの使い方やよくある質問をご確認ください。</p>
                <div className="flex flex-col gap-4">
                    <Link href="/help/faq" className="text-blue-600 hover:underline">
                        よくある質問 (FAQ)
                    </Link>
                    <Link href="/help/contact" className="text-blue-600 hover:underline">
                        お問い合わせ
                    </Link>
                </div>
                <div className="mt-8">
                    <Link href="/" className="text-zinc-500 hover:text-zinc-700">← ホームに戻る</Link>
                </div>
            </main>
        </div>
    );
}
