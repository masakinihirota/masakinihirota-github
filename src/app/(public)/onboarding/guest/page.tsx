"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GuestOnboarding() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleGuest() {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/guest', { method: 'POST' })
            const body = await res.json()

            if (!res.ok) {
                setError(body?.error ?? '匿名サインインに失敗しました')
                setLoading(false)
                return
            }

            // backend should have created a session cookie; navigate to protected onboarding
            router.push('/onboarding')
        } catch (err) {
            setError((err as Error).message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <main className="max-w-md text-center">
                <h1 className="text-xl font-semibold mb-3">匿名で試す</h1>
                <p className="text-zinc-600 mb-6">匿名ユーザーとしてオンボーディングを体験します（セッションはSupabaseで作成されます）。</p>

                {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={handleGuest}
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? '処理中…' : '匿名でオンボーディングを開始'}
                    </button>

                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
                        トップページに戻る
                    </Link>
                </div>
            </main>
        </div>
    )
}
