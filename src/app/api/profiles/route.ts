import { NextResponse } from 'next/server'
import { createProfile } from '@/actions/createProfile.fetch'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const supabase = await createClient()
    const userRes = await supabase.auth.getUser()
    const user = userRes?.data?.user ?? null
    const ctx = { session: { user: user ? { id: user.id } : undefined } }

    const res = await createProfile(body, ctx as unknown as { session?: { user?: { id: string } } })
    return NextResponse.json({ success: true, data: res })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export const runtime = 'nodejs'
