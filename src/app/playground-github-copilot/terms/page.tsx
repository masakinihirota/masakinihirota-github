import { termsDummy } from './dummy'

export const metadata = { title: '利用規約サンプル' }

export default function Terms() {
    const d = termsDummy
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">利用規約</h2>
            <div className="text-sm text-muted-foreground mb-6">最終更新日: {d.updated}</div>

            <article className="space-y-4 border rounded p-6 text-sm text-muted-foreground">
                {d.articles.map(a => (
                    <section key={a.id}>
                        <h3 className="font-semibold">{a.title}</h3>
                        <ol className="pl-4 list-decimal mt-2 text-xs text-gray-700">
                            {a.items.map((it, idx) => <li key={idx}>{it}</li>)}
                        </ol>
                    </section>
                ))}
            </article>

            <div className="mt-6 text-right">
                <button className="px-3 py-1 bg-blue-600 text-white rounded">同意して登録へ進む</button>
            </div>
        </div>
    )
}
