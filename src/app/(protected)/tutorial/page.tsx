import Link from "next/link";

export default function TutorialPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-lg text-center">
                <h1 className="text-xl font-semibold mb-3">チュートリアル</h1>
                <p className="text-zinc-600 mb-6">簡単なチュートリアル（仮）。完了で HOME へ遷移します。</p>
                <div className="flex gap-3 justify-center">
                    <Link href="/onboarding" className="text-sm text-zinc-500">戻る</Link>
                    <Link href="/home" className="text-sm text-blue-600">完了 → HOME</Link>
                </div>
            </main>
        </div>
    );
}
