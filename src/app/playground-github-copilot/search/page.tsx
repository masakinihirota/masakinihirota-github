import { searchDummy } from './dummy'

export const metadata = { title: '検索サンプル' }

export default function SearchSample() {
    const d = searchDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">検索（ダミー）</h2>

            <div className="mb-4 flex gap-2">
                <input placeholder="キーワードを入力..." className="flex-1 border rounded px-2 py-1" />
                <button className="px-3 py-1 bg-blue-600 text-white rounded">検索</button>
            </div>

            <div className="flex gap-2 text-sm mb-4">
                {d.tabs.map(t => <div key={t} className="px-2 py-1 border rounded text-xs">{t}</div>)}
            </div>

            <div className="space-y-3">
                {d.results.map(r => (
                    <div key={r.id} className="border rounded p-3">
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.type} • {r.meta}</div>
                        <div className="mt-2 text-sm">{r.summary}</div>
                        <div className="mt-2 text-xs text-blue-600 underline">詳細を見る</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
