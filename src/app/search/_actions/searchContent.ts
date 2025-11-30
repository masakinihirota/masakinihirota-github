import { searchWorks } from '@/actions/searchWorks.fetch'

export async function searchContent(payload: { q?: string; scope?: string }) {
    const q = payload.q ?? ''
    const scope = payload.scope ?? 'works'

    if (!q || q.toString().trim().length === 0) {
        throw new Error('q is required')
    }

    if (scope === 'works') {
        const rows = await searchWorks({ q: q.toString() })
        // normalize the rows shape to ensure a consistent client-friendly type
        return (rows ?? []).map((r: any) => ({ id: String(r.id), title: String(r.title ?? '') }))
    }

    // For MVP, only works supported
    throw new Error(`Scope not supported: ${scope}`)
}

export default searchContent
