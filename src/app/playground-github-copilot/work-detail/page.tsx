import { workDetailDummy } from './dummy'

export const metadata = { title: '作品詳細サンプル' }

export default function WorkDetail() {
    const w = workDetailDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">作品詳細 — {w.title}</h2>

            <div className="border rounded p-4 mb-6">
                <div className="flex gap-4">
                    <div className="w-64 h-44 bg-gray-100 rounded flex items-center justify-center">サムネ</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold">{w.title}</h3>
                        <div className="text-sm text-muted-foreground">作者: {w.authors.join(', ')}</div>
                        <div className="mt-3 text-sm">カテゴリ: {w.category} • {w.genre.join(', ')} • {w.year}</div>
                        <div className="mt-4 flex items-center gap-3">
                            <button className="px-3 py-1 bg-yellow-300 rounded">👏 {w.claps}</button>
                            <div className="text-sm text-muted-foreground">サイズ: {w.size}</div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mb-6">
                <h4 className="font-semibold mb-2">作品説明</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">{w.description}</div>
            </section>

            <section>
                <h4 className="font-semibold mb-2">関連リンク</h4>
                <ul className="list-disc pl-4 text-sm text-blue-600 underline">
                    {w.links.map((l, i) => <li key={i}><a href={l.href} target="_blank" rel="noreferrer">{l.title}</a></li>)}
                </ul>
            </section>
        </div>
    )
}
