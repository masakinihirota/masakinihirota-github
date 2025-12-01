import Link from 'next/link'

export default function ResultsList({ rows }: { rows: Array<{ id: string; title: string }> }) {
    return (
        <ul className="mt-4 space-y-3">
            {rows.map((r) => (
                <li key={r.id} className="p-3 border rounded-md hover:shadow-sm">
                    <Link href={`/works/${r.id}`} className="font-medium text-zinc-900">{r.title}</Link>
                    <div className="text-sm text-zinc-500">作品ID: {r.id}</div>
                </li>
            ))}
        </ul>
    )
}
