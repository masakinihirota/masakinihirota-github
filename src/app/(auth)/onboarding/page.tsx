import Link from "next/link";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-lg text-center">
                <h1 className="text-xl font-semibold mb-3">オンボーディング</h1>
                <p className="text-zinc-600 mb-6">初期設定のガイド。チュートリアルを完了するかスキップして HOME へ。</p>

                <div className="flex gap-3 justify-center">
                    <Link href="/tutorial" className="text-sm text-blue-600">チュートリアルへ</Link>
                    <Link href="/home" className="text-sm text-zinc-500">スキップして HOME</Link>
                </div>
            </main>
        </div>
    );
}
