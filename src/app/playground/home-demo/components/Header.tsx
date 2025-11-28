
import { Search, Bell, Settings, User } from 'lucide-react';
import { currentUser } from '../data';

export function Header() {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center flex-1">
                <div className="md:hidden mr-4">
                    {/* Mobile menu button placeholder */}
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <div className="relative w-full max-w-md hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="作品、ユーザー、価値観を検索..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">ルートアカウント</span>
                    <User className="h-6 w-6" />
                </button>

                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                    <span className="sr-only">通知</span>
                    <Bell className="h-6 w-6" />
                    {currentUser.notificationsCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </button>

                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">設定</span>
                    <Settings className="h-6 w-6" />
                </button>

                <div className="ml-3 relative">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2 hidden md:block">{currentUser.displayName}</span>
                        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                            {/* Placeholder for avatar */}
                            <img src="https://ui-avatars.com/api/?name=Taro+Yamada" alt={currentUser.displayName} className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
