import { oasisDummy } from './dummy'

export const metadata = { title: 'オアシス宣言' }

export default function OasisPage() {
    const d = oasisDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">オアシス宣言 — Oasis Declaration</h2>
            <div className="text-sm text-muted-foreground mb-4">{d.subtitle}</div>

            <article className="border rounded p-6 space-y-4">
                {d.sections.map(s => (
                    <section key={s.id}>
                        <h3 className="font-semibold text-lg">{s.title}</h3>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.text}</div>
                    </section>
                ))}
            </article>

            <div className="mt-6 text-right">
                <button className="px-3 py-1 bg-blue-600 text-white rounded">同意して登録へ進む</button>
            </div>
        </div>
    )
}
