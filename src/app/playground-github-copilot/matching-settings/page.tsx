import { matchingDummy } from './dummy'

export const metadata = { title: 'マッチング設定 サンプル' }

export default function MatchingSettings() {
    const d = matchingDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">マッチング設定（ダミー）</h2>

            <section className="border rounded p-4 mb-4">
                <h4 className="font-semibold mb-2">価値観の重要度</h4>
                <div className="space-y-2">
                    {d.values.map(v => (
                        <div key={v.id} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="text-sm">{v.title}</div>
                                <div className="text-xs text-muted-foreground">{v.description}</div>
                            </div>
                            <div className="w-40 text-right text-sm">{v.weight}%</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border rounded p-4 mb-4">
                <h4 className="font-semibold mb-2">作品ジャンル優先度</h4>
                <div className="flex flex-wrap gap-2">
                    {d.genres.map(g => (
                        <div key={g} className="text-xs px-2 py-1 border rounded">{g}</div>
                    ))}
                </div>
            </section>

            <section className="border rounded p-4">
                <h4 className="font-semibold mb-2">スキルの絞り込み</h4>
                <div className="flex flex-wrap gap-2">
                    {d.skills.map(s => (
                        <div key={s} className="text-xs px-2 py-1 border rounded">{s}</div>
                    ))}
                </div>
            </section>
        </div>
    )
}
