import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-md text-center">
                <h1 className="text-xl font-semibold mb-3">新規会員登録</h1>
                <p className="text-zinc-600 mb-6">新規登録が完了するとオンボーディングへ進みます（仮のページ）。</p>

                <div className="flex gap-3 justify-center">
                    <Link href="/" className="text-sm text-zinc-500">戻る</Link>
                    <Link href="/onboarding" className="text-sm text-blue-600">登録完了 → オンボーディング</Link>
                </div>
            </main>
        </div>
    );
}
