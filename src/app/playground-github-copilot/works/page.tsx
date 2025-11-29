import { worksDummy } from './dummy'

export const metadata = { title: '作品一覧サンプル' }

export default function WorksList() {
    const list = worksDummy
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">作品一覧（ダミー）</h2>

            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">件数: {list.count}件</div>
                <div className="flex gap-2">
                    <input className="border rounded px-2 py-1 text-sm" placeholder="作品を検索..." />
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">検索</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {list.works.map(w => (
                    <article key={w.id} className="border rounded p-3">
                        <div className="h-36 bg-gray-100 rounded mb-2 flex items-center justify-center">画像</div>
                        <div className="font-semibold">{w.title}</div>
                        <div className="text-xs text-muted-foreground">{w.authors.join(', ')} • {w.year}</div>
                        <div className="mt-2 text-sm">👏 {w.claps}</div>
                    </article>
                ))}
            </div>
        </div>
    )
}
