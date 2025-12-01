"use client";
import Link from 'next/link';
import { Home, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 border-r border-sidebar-border max-h-screen sticky top-0 bg-sidebar/80 backdrop-blur-md flex flex-col justify-between" aria-label="Home2 left sidebar">
      <div className="flex flex-col gap-4">
        <Link href="/home2" className="px-2 py-1 text-sm font-bold text-sidebar-foreground" data-testid="home2-brand">Home2</Link>

        <nav aria-label="home2 primary nav" data-testid="home2-primary-nav" className="flex flex-col gap-2">
          <Link href="/home2/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Home className="w-5 h-5 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Dashboard</span>
          </Link>

          <Link href="/home2/profiles" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Users className="w-5 h-5 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Profiles</span>
          </Link>

          <Link href="/home2/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="w-5 h-5 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Settings</span>
          </Link>
        </nav>
      </div>

      <div className="mt-6 pt-2">
        <div className="text-xs text-muted-foreground">© masakinihirota</div>
      </div>
    </aside>
  );
}
