import Link from 'next/link';

import { samples } from './ui/samplesMeta';

export default function SampleIndexPage() {
    return (
        <section className="container max-w-4xl py-12">
            <h1 className="text-3xl font-bold mb-6">UI サンプル一覧</h1>
            <p className="text-muted-foreground mb-6">ここでは、プロジェクト内にある UI サンプルを静的ページとして一覧表示します。各項目をクリックするとサンプル表示ページに遷移します。</p>

            <ul className="grid gap-3">
                {samples.map((s) => (
                    <li key={s.slug} className="rounded-lg border hover:shadow-md transition-shadow">
                        <Link
                            href={`/sample/ui/${s.slug}`}
                            className="block p-4 w-full text-inherit no-underline focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            aria-label={`View sample ${s.title}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="font-semibold">{s.title}</div>
                                    {s.description && <div className="text-sm text-muted-foreground mt-1">{s.description}</div>}
                                </div>
                                <div className="text-sm text-emerald-600">見る →</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
