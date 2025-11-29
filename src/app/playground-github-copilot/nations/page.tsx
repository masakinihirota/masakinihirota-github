import { nationsDummy } from './dummy'

export const metadata = { title: '国一覧 サンプル' }

export default function Nations() {
    const d = nationsDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">国一覧（ダミー）</h2>

            <div className="mb-3 text-sm text-muted-foreground">{d.count}件 の結果</div>

            <div className="space-y-3">
                {d.nations.map(n => (
                    <div key={n.id} className="border rounded p-3 flex items-start gap-3">
                        <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center">国</div>
                        <div className="flex-1">
                            <div className="font-semibold">{n.name} <span className="text-xs text-muted-foreground">• {n.level}</span></div>
                            <div className="text-xs text-muted-foreground">人口: {n.population} • 維持費: {n.cost}/月</div>
                            <div className="text-xs mt-1">{n.summary}</div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <button className="px-3 py-1 border rounded text-sm">詳細を見る</button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">加入申請</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
