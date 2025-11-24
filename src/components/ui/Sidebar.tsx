"use client";
import Link from 'next/link';
import { useState } from 'react';
import { authNav } from '@/config/nav';
// prefer generated manifest if available (build step creates src/config/routes.manifest.json)
let ROUTE_MANIFEST: any = null;
try {
    // require used because this is a client component bundler will inline JSON
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ROUTE_MANIFEST = require('@/config/routes.manifest.json');
} catch (e) {
    // no manifest present, will fall back to authNav
    ROUTE_MANIFEST = null;
}

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);

    // if manifest exists, derive main/more from it, otherwise use authNav
    const entries: any[] = Array.isArray(ROUTE_MANIFEST) ? ROUTE_MANIFEST : authNav;
    const main = entries.filter((i) => (i.group === 'main' || i.group === 'main')).map(e => ({ label: e.label, href: e.path || e.href }));
    const more = entries.filter((i) => i.group === 'more').map(e => ({ label: e.label, href: e.path || e.href }));

    return (
        <aside className="w-64 p-4 border-r min-h-screen sticky top-0">
            <div className="flex flex-col gap-3">
                {main.map(item => (
                    <Link key={item.href} href={item.href} className="px-3 py-2 rounded hover:bg-zinc-100">
                        {item.label}
                    </Link>
                ))}

                <div className="mt-4 border-t pt-3">
                    <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-3 py-2 rounded hover:bg-zinc-100">
                        もっと見る
                    </button>

                    {expanded && (
                        <div className="mt-2 flex flex-col gap-2">
                            {more.map(item => (
                                <Link key={item.href} href={item.href} className="px-3 py-2 rounded hover:bg-zinc-100">
                                    {item.label}
                                </Link>
                            ))}

                            <div className="mt-4 border-t pt-3">
                                <div className="text-sm text-zinc-500">ルートアカウント</div>
                                <Link href="/root-accounts" className="block px-3 py-2 rounded hover:bg-zinc-100">ルートダッシュボード</Link>
                                <Link href="/root-accounts/create" className="block px-3 py-2 rounded hover:bg-zinc-100">ルートアカウント作成</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
