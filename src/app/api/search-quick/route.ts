import { NextResponse } from 'next/server'
import { searchWorks } from '@/actions/searchWorks.fetch'

export async function GET(req: Request) {
  try {
    const u = new URL(req.url)
    const q = (u.searchParams.get('q') ?? '').toString()
    if (!q || q.trim().length === 0) return NextResponse.json({ success: true, data: [] })

    // For MVP we only look up works and return light-weight objects
    const rows = await searchWorks({ q })

    const data = (rows ?? []).map((r: any) => ({ id: r.id, title: r.title, type: 'work' }))

    return NextResponse.json({ success: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export const runtime = 'edge'
