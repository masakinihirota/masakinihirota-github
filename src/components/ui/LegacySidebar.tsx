
"use client";
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { authNav } from '@/config/nav';
import { Home, Search, Bell, Mail, Bookmark, Users, MoreHorizontal, Plus, Building2, Flag, Link2, Grid, Trophy, Activity, LogOut, UserPlus } from 'lucide-react';
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
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    // Close account menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setShowAccountMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // if manifest exists, derive main/more from it, otherwise use authNav
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: any[] = Array.isArray(ROUTE_MANIFEST) ? ROUTE_MANIFEST : authNav;
    // Exclude root-accounts from the main menu so it only appears in the footer/account slot
    const main = entries
        .filter((i) => i.group === 'main')
        .filter(e => { const path = (e.path || e.href || '').toString(); return !path.includes('root-accounts'); })
        .map(e => ({ label: e.label, href: e.path || e.href }));
    const more = entries.filter((i) => i.group === 'more').map(e => ({ label: e.label, href: e.path || e.href }));

    // helper: choose icon by path
    const iconFor = (href: string) => {
        if (href.includes('/home')) return Home;
        if (href.includes('/profiles') || href.includes('プロフィール')) return Users;
        if (href.includes('/matching')) return Search;
        if (href.includes('/notifications')) return Bell;
        if (href.includes('/messages')) return Mail;
        if (href.includes('/works') || href.includes('/skills')) return Bookmark;
        if (href.includes('/organizations')) return Building2;
        if (href.includes('/nations')) return Flag;
        if (href.includes('/chain')) return Link2;
        if (href.includes('/mandala')) return Grid;
        if (href.includes('/achievements')) return Trophy;
        if (href.includes('/activity')) return Activity;
        return MoreHorizontal;
    };

    // Make the sidebar scrollable and bounded to viewport so footer/root-account stays inside the page area
    // instead of being forced off-screen. Use max-h-screen + overflow-y-auto so the sidebar content
    // can scroll independently when long, and the footer will be part of that scrollable area.
    return (
           <aside className="w-72 md:w-64 lg:w-72 p-4 border-r border-sidebar-border max-h-screen sticky top-0 overflow-y-auto bg-sidebar/80 backdrop-blur-md flex flex-col justify-between" aria-label="Left sidebar">
            <div className="flex flex-col gap-2">
                <Link href="/home" className="px-2 py-1 text-sm font-bold text-sidebar-foreground" data-testid="sidebar-brand" aria-label="masakinihirota home">masakinihirota</Link>

                <nav aria-label="Primary navigation" data-testid="sidebar-primary-nav">
                {main.map(item => {
                    const Icon = iconFor(item.href || item.label);
                    return (
                        <Link
                            key={item.href ?? item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                        >
                            <Icon className="w-6 h-6 text-sidebar-foreground" />
                            <span className="hidden md:inline-block text-lg text-sidebar-foreground">{item.label}</span>
                        </Link>
                    );
                })}
                </nav>

                {/* more / expandable list */}
                <div className="mt-1">
                    <button
                        aria-expanded={expanded}
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                    >
                        <MoreHorizontal className="w-6 h-6 text-sidebar-foreground" />
                        <span className="hidden md:inline-block text-lg text-sidebar-foreground">もっと見る</span>
                    </button>

                    {expanded && (
                        <div className="mt-2 flex flex-col gap-2 pl-2 border-l border-sidebar-border ml-6">
                            {more.map(item => {
                                const Icon = iconFor(item.href || item.label);
                                return (
                                    <Link key={item.href ?? item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                        <Icon className="w-5 h-5 text-muted-foreground" />
                                        <span className="hidden md:inline-block text-sm text-sidebar-foreground">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}


                </div>
            </div>

            {/* footer: user info */}
            <div className="mt-6 pt-2 relative" ref={accountMenuRef}>
                {showAccountMenu && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-popover border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                        <Link href="/root-accounts" className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground text-sm text-popover-foreground">
                            <UserPlus className="w-4 h-4" />
                            既存のアカウントを追加
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground text-sm text-popover-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                            設定
                        </Link>
                        <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground text-sm text-popover-foreground border-t border-border">
                            <LogOut className="w-4 h-4" />
                            masakinihirotaからログアウト
                        </Link>
                    </div>
                )}

                <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center justify-between w-full px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-full cursor-pointer transition-colors group"
                    aria-label="アカウントメニュー"
                    aria-expanded={showAccountMenu}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">M</div>
                        <div className="hidden md:block text-left">
                            <div className="text-sm font-bold text-sidebar-foreground">masakinihirota</div>
                            <div className="text-xs text-muted-foreground">@masakinihirota</div>
                        </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground hidden md:block" />
                </button>
            </div>
        </aside>
    );
}
