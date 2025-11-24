import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Create an anonymous session for the visitor
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If supabase sets cookies via createServerClient, they are attached automatically.
    // Return success — client will redirect to /onboarding.
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
