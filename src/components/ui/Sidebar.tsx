"use client";
import Link from 'next/link';
import { useState } from 'react';
import { authNav } from '@/config/nav';
import { Home, Search, Bell, Mail, Bookmark, Users, MoreHorizontal, Plus } from 'lucide-react';
// prefer generated manifest if available (build step creates src/config/routes.manifest.json)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ROUTE_MANIFEST: any = null;
try {
    // require used because this is a client component bundler will inline JSON
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ROUTE_MANIFEST = require('@/config/routes.manifest.json');
} catch {
    // no manifest present, will fall back to authNav
    ROUTE_MANIFEST = null;
}

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);

    // if manifest exists, derive main/more from it, otherwise use authNav
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: any[] = Array.isArray(ROUTE_MANIFEST) ? ROUTE_MANIFEST : authNav;
    const main = entries.filter((i) => (i.group === 'main' || i.group === 'main')).map(e => ({ label: e.label, href: e.path || e.href }));
    const more = entries.filter((i) => i.group === 'more').map(e => ({ label: e.label, href: e.path || e.href }));

    // helper: choose icon by path
    const iconFor = (href: string) => {
        if (href.includes('/home')) return Home;
        if (href.includes('/profiles') || href.includes('プロフィール')) return Users;
        if (href.includes('/matching')) return Search;
        if (href.includes('/notifications')) return Bell;
        if (href.includes('/messages')) return Mail;
        if (href.includes('/works') || href.includes('/skills')) return Bookmark;
        return MoreHorizontal;
    };

    return (
        <aside className="w-72 md:w-64 lg:w-72 p-4 border-r min-h-screen sticky top-0 bg-white/80 backdrop-blur-md">
            <div className="flex flex-col justify-between h-full">
                {/* top navigation */}
                <div className="flex flex-col gap-2">
                    <Link href="/home" className="px-2 py-1 text-sm font-bold">masakinihirota</Link>

                    {/* quick access: search */}
                    <Link
                        key={'/search'}
                        href={'/search'}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <Search className="w-5 h-5 text-zinc-700" />
                        <span className="hidden md:inline-block text-sm text-zinc-800">検索</span>
                    </Link>

                    {main.map(item => {
                        const Icon = iconFor(item.href || item.label);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <Icon className="w-5 h-5 text-zinc-700" />
                                <span className="hidden md:inline-block text-sm text-zinc-800">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* more / expandable list */}
                    <div className="mt-2 border-t pt-3">
                        <button
                            aria-expanded={expanded}
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <MoreHorizontal className="w-5 h-5 text-zinc-700" />
                            <span className="hidden md:inline-block text-sm text-zinc-700">もっと見る</span>
                        </button>

                        {expanded && (
                            <div className="mt-2 flex flex-col gap-2">
                                {more.map(item => (
                                    <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100">
                                        <MoreHorizontal className="w-5 h-5 text-zinc-600" />
                                        <span className="hidden md:inline-block text-sm text-zinc-700">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* action button similar to X.com 'Post' */}
                        <div className="mt-4">
                            <Link href="/works/new" className="inline-flex items-center justify-center w-full px-3 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <Plus className="w-4 h-4 mr-2" /> ポストする
                            </Link>
                        </div>
                    </div>
                </div>

                {/* footer: user info */}
                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-100 rounded-md cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-white">M</div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">masakinihirota</div>
                            <div className="text-xs text-zinc-500">@masakinihirota</div>
                        </div>
                        <div className="text-zinc-400">•••</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
