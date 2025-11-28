import { NextResponse } from 'next/server'
import { searchWorks } from '@/actions/searchWorks.fetch'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const q = (body?.q ?? '') as string

    const result = await searchWorks({ q })
    return NextResponse.json({ success: true, data: result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export const runtime = 'nodejs'
