import { organizationsDummy } from './dummy'

export const metadata = { title: '組織一覧 サンプル' }

export default function Organizations() {
    const d = organizationsDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">組織一覧（ダミー）</h2>

            <div className="mb-3 text-sm text-muted-foreground">{d.count}件 の結果</div>

            <div className="space-y-3">
                {d.organizations.map(o => (
                    <div key={o.id} className="border rounded p-3 flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">ICON</div>
                        <div className="flex-1">
                            <div className="font-semibold">{o.name}</div>
                            <div className="text-xs text-muted-foreground">リーダー: {o.leader} • メンバー: {o.members}/{o.capacity}</div>
                            <div className="text-xs mt-1">{o.summary}</div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <button className="px-3 py-1 border rounded text-sm">詳細を見る</button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">参加申請</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
