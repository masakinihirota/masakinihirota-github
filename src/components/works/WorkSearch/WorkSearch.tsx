import React, { useState } from 'react'
import { searchWorksAction } from './WorkSearch.fetch'

export function WorkSearch({ onSelect }: { onSelect?: (work: { id: string; title: string }) => void }) {
    const [q, setQ] = useState('')
    const [results, setResults] = useState<Array<any>>([])

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const formData = new FormData()
        formData.append('q', q)

        const res = await searchWorksAction({}, formData)
        if (res?.success) setResults(res.data ?? [])
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input aria-label="work-search" value={q} onChange={(e) => setQ(e.target.value)} />
                <button type="submit">Search</button>
            </form>

            <ul>
                {results.map((r: any) => (
                    <li key={r.id}>
                        {r.title} <button type="button" onClick={() => onSelect?.({ id: r.id, title: r.title })}>Add</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WorkSearch
