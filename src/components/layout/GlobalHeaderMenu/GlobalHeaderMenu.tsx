"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// lightweight debounce
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 250) {
    let t: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<T>) => {
        if (t) clearTimeout(t)
        t = setTimeout(() => fn(...args), wait)
    }
}

/**
 * グローバルヘッダーメニュー
 * クイック検索機能を提供するヘッダーコンポーネント
 */
export function GlobalHeaderMenu() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [results, setResults] = useState<Array<{ id: string; title: string; type: string }>>([])
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement | null>(null)

    function submit(e?: React.FormEvent) {
        e?.preventDefault();
        const params = new URLSearchParams();
        if (q.trim().length) params.set("q", q.trim());
        router.push(`/search?${params.toString()}`);
    }

    async function doQuickSearch(text: string) {
        if (!text || text.trim().length === 0) {
            setResults([])
            setOpen(false)
            return
        }

        try {
            const res = await fetch(`/api/search-quick?q=${encodeURIComponent(text)}`)
            if (!res.ok) throw new Error('search failed')
            const json = await res.json()
            setResults(json?.data ?? [])
            setOpen((json?.data ?? []).length > 0)
        } catch (err) {
            setResults([])
            setOpen(false)
        }
    }

    // debounced quick search
    const debounced = useRef(debounce((v: string) => doQuickSearch(v), 200)).current

    useEffect(() => {
        const el = rootRef.current
        function onDocClick(e: MouseEvent) {
            if (!el) return
            if (!(e.target instanceof Node) || el.contains(e.target)) return
            setOpen(false)
        }
        document.addEventListener('click', onDocClick)
        return () => document.removeEventListener('click', onDocClick)
    }, [])

    return (
        <form onSubmit={submit} className="flex items-center space-x-2">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    aria-label="ヘッダークイック検索"
                    placeholder="作品を検索…（Enterで詳細検索ページへ）"
                    value={q}
                    onChange={(e) => { setQ(e.target.value); debounced(e.target.value) }}
                    className="pl-8 pr-3 py-1 rounded-md border bg-background text-sm w-40 md:w-56 focus:outline-none focus:ring-2 focus:ring-primary h-9"
                />
            </div>

            {/* Minimal quick search: input only, submit via Enter */}

            {/* quick dropdown */}
            {open && (
                <div className="absolute mt-1 w-80 bg-popover border rounded-md shadow-lg right-0 z-50 p-2 text-popover-foreground" role="listbox">
                    {results.slice(0,5).map((r) => (
                        <div key={r.id} className="py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded">
                            <a href={r.type === 'work' ? `/works/${r.id}` : '#'} className="flex items-center gap-3">
                                <span className="inline-block text-xs text-muted-foreground">{r.type}</span>
                                <span className="text-sm font-medium">{r.title}</span>
                            </a>
                        </div>
                    ))}
                    <div className="mt-2 border-t pt-2 text-center">
                        <a href={`/search?q=${encodeURIComponent(q)}`} className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground text-sm">もっと詳しく検索</a>
                    </div>
                </div>
            )}
        </form>
    );
}

// デフォルトエクスポートも残す（後方互換性のため）
export default GlobalHeaderMenu;
