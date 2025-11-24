import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black p-8">
            <main className="max-w-2xl text-center">
                <h1 className="text-2xl font-semibold mb-4">masakinihirota</h1>
                <p className="text-zinc-600 mb-6">ようこそ — 最初の一歩を踏み出しましょう。</p>

                <p className="text-sm text-zinc-500">上部ナビから次のページへ移動できます。</p>

                <div className="mt-6 flex gap-3 justify-center">
                    <a
                        href="https://x.com/masakinihirota"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-zinc-500 hover:underline"
                    >
                        最新情報 (X.com)
                    </a>

                    <a
                        href="/onboarding/guest"
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                        匿名で試す
                    </a>
                </div>

                <footer className="mt-8 text-sm text-zinc-400">© masakinihirota</footer>
            </main >
        </div >
    );
}
