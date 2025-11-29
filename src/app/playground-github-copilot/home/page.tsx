import { homeDummy } from './dummy'

export const metadata = { title: 'HOME サンプル' }

export default function HomeSample() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-6">
                <h2 className="text-2xl font-bold">HOME（ホーム画面） — ダミーデータ</h2>
                <p className="text-sm text-muted-foreground">Supabase 形式のダミーデータを使用しています（読み取り専用）。</p>
            </header>

            <section className="border rounded p-4 mb-4">
                <div className="flex items-center gap-4">
                    <img src={homeDummy.account.icon} className="w-16 h-16 rounded-full" alt="avatar" />
                    <div>
                        <div className="font-semibold">{homeDummy.account.display_name}</div>
                        <div className="text-sm text-muted-foreground">{homeDummy.account.location} • {homeDummy.account.native_language}</div>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-xl font-bold">{homeDummy.account.points} pt</div>
                        <div className="text-xs text-muted-foreground">ポイント残高</div>
                    </div>
                </div>
            </section>

            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">ユーザープロフィール一覧</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {homeDummy.profiles.map(p => (
                        <article key={p.id} className="border rounded p-3">
                            <div className="flex items-center gap-3">
                                <img src={p.icon} className="w-10 h-10 rounded-full" alt="p" />
                                <div>
                                    <div className="font-semibold">{p.name}</div>
                                    <div className="text-xs text-muted-foreground">目的: {p.purpose}</div>
                                </div>
                                <div className="ml-auto text-xs"><button className="text-blue-600 underline">詳細を見る</button></div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">アチーブメント</h3>
                <ul className="space-y-2">
                    {homeDummy.achievements.map(a => (
                        <li key={a.id} className="flex items-center gap-3 border rounded p-3">
                            <div className="text-2xl">{a.icon}</div>
                            <div>
                                <div className="font-semibold">{a.title}</div>
                                <div className="text-xs text-muted-foreground">{a.description}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
