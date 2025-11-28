import { rootAccountDummy } from './dummy'

export const metadata = { title: 'ルートアカウント サンプル' }

export default function RootAccountPage() {
    const r = rootAccountDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">ルートアカウント（ダミー）</h2>
            <div className="border rounded p-4 mb-6">
                <div className="flex items-center gap-4">
                    <img src={r.root.icon} className="w-20 h-20 rounded-full" alt="icon" />
                    <div>
                        <div className="text-xl font-semibold">{r.root.display_name}</div>
                        <div className="text-sm text-muted-foreground">{r.root.location} • {r.root.native_language}</div>
                        <div className="mt-2 text-sm">ポイント: <span className="font-bold">{r.root.points} pt</span></div>
                    </div>
                </div>
            </div>

            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">所有するユーザープロフィール</h3>
                <div className="space-y-3">
                    {r.profiles.map(p => (
                        <div key={p.id} className="flex items-center border rounded p-3">
                            <img src={p.icon} className="w-12 h-12 rounded-full mr-3" />
                            <div className="flex-1">
                                <div className="font-semibold">{p.name}</div>
                                <div className="text-xs text-muted-foreground">目的: {p.purpose} • 役割: {p.role}</div>
                            </div>
                            <div className="text-sm text-blue-600 underline">編集</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">取引履歴（ポイント）</h3>
                <ul className="space-y-2">
                    {r.transactions.map(t => (
                        <li key={t.id} className="flex justify-between border rounded p-2 text-sm">
                            <div>{t.title}</div>
                            <div className={`${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{t.amount > 0 ? `+${t.amount}` : t.amount} pt</div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
