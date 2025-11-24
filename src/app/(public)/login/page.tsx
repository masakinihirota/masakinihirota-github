import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-md text-center">
                <h1 className="text-xl font-semibold mb-3">ログイン</h1>
                <p className="text-zinc-600 mb-6">OAuth または既存アカウントでログインします（仮のページ）。</p>

                <div className="flex gap-3 justify-center">
                    <Link href="/" className="text-sm text-zinc-500">戻る</Link>
                    <Link href="/home" className="text-sm text-blue-600">認証成功 → HOME</Link>
                </div>
            </main>
        </div>
    );
}
