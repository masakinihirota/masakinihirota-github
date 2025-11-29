import { workNewDummy } from './dummy'

export const metadata = { title: '作品登録 サンプル' }

export default function WorkNew() {
    const d = workNewDummy
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">作品登録（ダミーフォーム）</h2>

            <form className="space-y-3 border rounded p-4">
                <label className="block">
                    <div className="text-xs text-muted-foreground">作品タイトル *</div>
                    <input className="w-full border rounded px-2 py-1" defaultValue={d.defaults.title} />
                </label>

                <label className="block">
                    <div className="text-xs text-muted-foreground">著者 *</div>
                    <input className="w-full border rounded px-2 py-1" defaultValue={d.defaults.authors[0]} />
                </label>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="text-xs text-muted-foreground">カテゴリ *</div>
                        <select className="w-full border rounded px-2 py-1" defaultValue={d.defaults.category}>
                            {d.categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="w-32">
                        <div className="text-xs text-muted-foreground">発売年 *</div>
                        <input className="w-full border rounded px-2 py-1" defaultValue={d.defaults.year} />
                    </div>
                </div>

                <label>
                    <div className="text-xs text-muted-foreground">説明 *</div>
                    <textarea className="w-full border rounded px-2 py-2" defaultValue={d.defaults.description} />
                </label>

                <div className="flex justify-end">
                    <button type="button" className="px-3 py-1 mr-2 border rounded">キャンセル</button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">登録する</button>
                </div>
            </form>

        </div>
    )
}
