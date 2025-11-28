import { profileDummy } from './dummy'

export const metadata = { title: 'ユーザープロフィール' }

export default function ProfileSample() {
    const p = profileDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">ユーザープロフィール（ダミー）</h2>

            <div className="border rounded p-4 mb-6">
                <div className="flex items-start gap-4">
                    <img src={p.profile.icon} className="w-20 h-20 rounded-full" />
                    <div>
                        <div className="text-xl font-semibold">{p.profile.name}</div>
                        <div className="text-sm text-muted-foreground">{p.profile.bio}</div>
                        <div className="mt-2 text-xs">目的: {p.profile.purpose} • 役割: {p.profile.role}</div>
                        <div className="mt-3">
                            <button className="px-3 py-1 border rounded mr-2">編集</button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded">フォロー</button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">登録作品</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {p.works.map(w => (
                        <div key={w.id} className="border rounded p-2 text-sm">
                            <div className="font-semibold">{w.title}</div>
                            <div className="text-xs text-muted-foreground">{w.size} • {w.year}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">スキル / 価値観</h3>
                <div className="flex flex-wrap gap-2">
                    {p.skills.map(s => (
                        <div key={s} className="text-xs border rounded px-2 py-1">{s}</div>
                    ))}
                </div>
            </section>
        </div>
    )
}
