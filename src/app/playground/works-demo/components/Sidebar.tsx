
import Link from 'next/link';
import { Home, Users, User, Building2, Globe, BookOpen, Heart, Zap, Link as LinkIcon, Grid, Settings, Shield } from 'lucide-react';

const menuItems = [
    { label: 'HOME', href: '/playground/home-demo', icon: Home },
    { label: 'マッチング', href: '/playground/home-demo/matching', icon: Users },
    { label: 'プロフィール', href: '/playground/profile-demo', icon: User },
    { label: '組織', href: '/playground/home-demo/organization', icon: Building2 },
    { label: '国（ネイション）', href: '/playground/home-demo/nation', icon: Globe },
    { label: '作品', href: '/playground/works-demo', icon: BookOpen, active: true },
    { label: '価値観', href: '/playground/home-demo/values', icon: Heart },
    { label: 'スキル', href: '/playground/home-demo/skills', icon: Zap },
    { label: 'チェーン', href: '/playground/home-demo/chain', icon: LinkIcon },
    { label: 'マンダラ', href: '/playground/home-demo/mandala', icon: Grid },
    { label: '設定', href: '/playground/home-demo/settings', icon: Settings },
    { label: 'ルートアカウント', href: '/playground/root-account-demo', icon: Shield },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
            <div className="p-4">
                <div className="text-xl font-bold mb-6 px-4 text-blue-600">VNS Demo</div>
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${item.active
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-blue-700' : 'text-gray-400'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
