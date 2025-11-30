"use client";
import Link from 'next/link';
import { Home, Users, Bell, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MENU = [
  { label: 'Dashboard', href: '/home3/dashboard', Icon: Home },
  { label: 'Profiles', href: '/home3/profiles', Icon: Users },
  { label: 'Notifications', href: '/home3/notifications', Icon: Bell, badge: 3 },
  { label: 'Settings', href: '/home3/settings', Icon: Settings },
];

export default function Sidebar() {
  return (
    <aside aria-label="Home3 left sidebar" className="w-64 p-4 border-r border-sidebar-border max-h-screen sticky top-0 bg-sidebar/80 backdrop-blur-md flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <Link href="/home3" className="px-2 py-1 text-sm font-bold text-sidebar-foreground" data-testid="home3-brand">Home3</Link>

        <nav aria-label="Home3 primary navigation" data-testid="home3-primary-nav" className="flex flex-col gap-2">
          {MENU.map((m) => (
            <Link key={m.href} href={m.href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" data-testid={`home3-link-${m.label.toLowerCase()}`}>
              <m.Icon className="w-5 h-5 text-sidebar-foreground" />
              <span className="text-sm text-sidebar-foreground">{m.label}</span>
              {m.badge !== undefined && (
                <span className="ml-auto" data-testid={`home3-notifications-badge`}>
                  <Badge className="rounded-full bg-red-600 text-white px-2 text-xs">{m.badge}</Badge>
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 pt-2">
        <div className="text-xs text-muted-foreground">Welcome, authenticated user</div>
      </div>
    </aside>
  );
}
