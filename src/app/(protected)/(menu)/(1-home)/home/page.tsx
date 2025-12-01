import Link from "next/link";

export default function HomePlaceholder() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-lg text-center">
                <h1 className="text-xl font-semibold mb-3">HOME（認証後のプレースホルダ）</h1>
                <p className="text-zinc-600 mb-6">これは認証後のメイン画面（プレースホルダ）です。</p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <Link href="/" className="text-sm text-zinc-500">ランディングへ</Link>
                    <Link href="/onboarding" className="text-sm text-blue-600">オンボーディングに戻る</Link>
                    <Link href="/home2" className="text-sm text-zinc-500">バックアップ: /home2</Link>
                    <Link href="/home3" className="text-sm text-zinc-500">バックアップ: /home3</Link>
                </div>
            </main>
        </div>
    );
}
