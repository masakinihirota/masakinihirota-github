
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, AlertTriangle, Settings, LogOut } from 'lucide-react';

export default function AdminDemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: 'ダッシュボード', href: '/playground/admin-demo/home', icon: LayoutDashboard },
        { name: 'ユーザー管理', href: '/playground/admin-demo/users', icon: Users },
        { name: 'コンテンツ管理', href: '/playground/admin-demo/contents', icon: FileText },
        { name: 'ペナルティ管理', href: '/playground/admin-demo/penalties', icon: AlertTriangle },
        { name: 'システム設定', href: '/playground/admin-demo/system', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">VNS Admin</h1>
                    <p className="text-xs text-gray-400 mt-1">System Administration</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/playground"
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Playgroundへ戻る
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {navigation.find((n) => n.href === pathname)?.name || 'Admin'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Admin User</span>
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
