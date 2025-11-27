"use client";
import React, { useState } from 'react';
import { Menu, X, Bell, Settings, Search, ChevronRight } from 'lucide-react';

// ==============================================================================
// 1. Mock Data (Supabase/Drizzleからの取得を想定)
// ==============================================================================

// ユーザー情報
const MOCK_USER = {
    display_name: "Taro Yamada",
    avatar_url: "https://placehold.co/40x40/4F46E5/FFFFFF?text=TY",
    notification_count: 3,
};

// ナビゲーションリンク
const MOCK_NAV = [
    { name: "HOME", icon: "🏠", href: "/home", current: true },
    { name: "国", icon: "🌐", href: "/countries", current: false },
    { name: "組織", icon: "🏢", href: "/organizations", current: false },
    { name: "プロフィール", icon: "👤", href: "/profiles", current: false },
    { name: "作品", icon: "📚", href: "/works", current: false },
    { name: "価値観", icon: "✨", href: "/values", current: false },
    { name: "スキル", icon: "🔨", href: "/skills", current: false },
    { name: "マッチング", icon: "🤝", href: "/matching", current: false },
    { name: "検索", icon: "🔍", href: "/search", current: false },
    { name: "おすすめ", icon: "💡", href: "/recommendations", current: false },
    { name: "リスト", icon: "📝", href: "/lists", current: false },
    { name: "チェーン", icon: "🔗", href: "/chains", current: false },
];

// 最近の活動履歴
const MOCK_ACTIVITIES = [
    { id: 1, text: "新しいマッチングが見つかりました（3件）", type: "matching", link: "/matching" },
    { id: 2, text: "Hanakoさんがあなたをフォローしました", type: "follow", link: "/user/hanako" },
    { id: 3, text: "あなたの作品「未来の都市設計」に拍手が送られました（5拍手）", type: "clap", link: "/works/1" },
    { id: 4, text: "組織「VNSラボ」に招待されました", type: "invite", link: "/organizations/vns-lab/invite" },
    { id: 5, text: "プロフィール達成率が80%になりました！", type: "profile", link: "/profile/edit" },
];

// おすすめユーザー
const MOCK_RECOMMENDED_USERS = [
    { id: 1, name: "Sato Kenji", match_rate: 85, avatar_text: "SK", profile_link: "/user/1" },
    { id: 2, name: "Tanaka Yuri", match_rate: 78, avatar_text: "TY", profile_link: "/user/2" },
    { id: 3, name: "Suzuki Aki", match_rate: 72, avatar_text: "SA", profile_link: "/user/3" },
];

// おすすめ作品
const MOCK_RECOMMENDED_WORKS = [
    { id: 1, title: "未来の都市設計", category: "建築/環境", link: "/work/1" },
    { id: 2, title: "AIと倫理の交差点", category: "テクノロジー/哲学", link: "/work/2" },
    { id: 3, title: "地域コミュニティ活性化", category: "社会貢献", link: "/work/3" },
];


// ==============================================================================
// 2. Component Sub-Elements
// ==============================================================================

/**
 * 共通のセクションタイトル
 */
const SectionTitle = ({ title }) => (
    <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500/50 pb-2 mb-4 mt-8">
        【{title}】
    </h2>
);

/**
 * おすすめユーザーカード
 */
const UserRecommendationCard = ({ user }) => (
    <a href={user.profile_link} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer border border-gray-100">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-3 ring-2 ring-indigo-300">
            {user.avatar_text}
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate max-w-[100px]">{user.name}</p>
        <p className="text-xs text-indigo-600 mt-1 font-medium">一致度: {user.match_rate}%</p>
    </a>
);

/**
 * おすすめ作品カード
 */
const WorkRecommendationCard = ({ work }) => (
    <a href={work.link} className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:translate-y-[-2px] cursor-pointer border border-gray-100">
        {/* モックサムネイル */}
        <div className="h-28 bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-medium">
            {work.title}
        </div>
        <div className="p-3">
            <h3 className="text-sm font-bold text-gray-800 truncate">{work.title}</h3>
            <p className="text-xs text-gray-500 mt-1">カテゴリ: {work.category}</p>
        </div>
    </a>
);

// ==============================================================================
// 3. Layout Components
// ==============================================================================

/**
 * ヘッダーコンポーネント
 */
const Header = ({ notificationCount, onMenuToggle }) => (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white shadow-md flex items-center justify-between px-4 sm:px-6">
        {/* ロゴとハンバーガーメニュー (モバイル/タブレット用) */}
        <div className="flex items-center">
            <button onClick={onMenuToggle} className="text-gray-500 sm:hidden mr-3 p-2 hover:bg-gray-100 rounded-lg transition">
                <Menu size={24} />
            </button>
            <div className="text-2xl font-black text-indigo-600">VNS</div>
        </div>

        {/* 検索バー (PC/タブレット用) */}
        <div className="hidden sm:block flex-grow max-w-lg mx-4">
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="search"
                    placeholder="作品、ユーザー、価値観を検索..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
        </div>

        {/* 右側アイコン群 */}
        <div className="flex items-center space-x-4">
            {/* 検索 (モバイル用) */}
            <button className="sm:hidden text-gray-600 hover:text-indigo-600 transition p-2">
                <Search size={24} />
            </button>

            {/* 通知アイコン */}
            <button className="relative text-gray-600 hover:text-indigo-600 transition p-2">
                <Bell size={24} />
                {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
            </button>

            {/* 設定アイコン */}
            <button className="text-gray-600 hover:text-indigo-600 transition p-2">
                <Settings size={24} />
            </button>

            {/* ルートアカウント/ユーザープロフィール */}
            <div className="relative group cursor-pointer">
                <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition">
                    <img src={MOCK_USER.avatar_url} alt="アバター" className="h-8 w-8 rounded-full object-cover" />
                    <span className="hidden md:block text-sm font-medium text-gray-700">{MOCK_USER.display_name.split(' ')[0]}</span>
                </div>
                {/* ドロップダウンメニュー（モック） */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden hidden group-hover:block transition-opacity duration-300 border border-gray-100 z-50">
                    <a href="/account-details" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">ルートアカウント詳細</a>
                    <a href="/profiles-list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">ユーザープロフィール一覧</a>
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">設定</a>
                    <div className="border-t"></div>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">ログアウト</button>
                </div>
            </div>
        </div>
    </header>
);

/**
 * サイドバーコンポーネント
 */
const Sidebar = ({ isMenuOpen, onMenuClose }) => (
    <>
        {/* モバイル/タブレット用のオーバーレイ */}
        <div
            className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity duration-300 sm:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={onMenuClose}
        ></div>

        {/* サイドバー本体 */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-30 transform transition-transform duration-300 border-r border-gray-100
      sm:relative sm:translate-x-0 sm:w-64 sm:shadow-none sm:h-auto
      ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="h-16 flex items-center justify-between px-4 sm:hidden">
                <div className="text-xl font-black text-indigo-600">VNS</div>
                <button onClick={onMenuClose} className="text-gray-500 p-2 hover:bg-gray-100 rounded-lg">
                    <X size={24} />
                </button>
            </div>

            <nav className="p-4 space-y-2 pt-4 sm:pt-0">
                <p className="text-xs font-semibold uppercase text-gray-400 mb-4">メインナビゲーション</p>
                {MOCK_NAV.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        onClick={onMenuClose}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
              ${item.current
                                ? 'bg-indigo-500 text-white shadow-md font-semibold'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>

            {/* ルートアカウント (Sidebar bottom mock) */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <img src={MOCK_USER.avatar_url} alt="アバター" className="h-8 w-8 rounded-full" />
                    <span className="text-sm font-medium text-gray-700 truncate">ルートアカウント</span>
                </div>
            </div>
        </div>
    </>
);

/**
 * メインコンテンツコンポーネント
 */
const MainContent = () => (
    <main className="flex-grow p-4 sm:p-8 bg-gray-50">
        {/* 1. ウェルカムメッセージ */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                ようこそ、<span className="text-indigo-600">{MOCK_USER.display_name}</span>さん
            </h1>
            <p className="text-md text-gray-500 mt-2">
                VNS masakinihirota で価値観を共有し、新たな繋がりを見つけましょう！
            </p>
        </div>

        {/* 2. クイックアクションセクション */}
        <SectionTitle title="クイックアクション" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton icon="📝" label="プロフィール作成" href="/profile/create" color="indigo" />
            <QuickActionButton icon="📚" label="作品登録" href="/work/register" color="emerald" />
            <QuickActionButton icon="🤝" label="マッチング開始" href="/matching" color="fuchsia" />
        </div>

        {/* 3. 最近の活動セクション */}
        <SectionTitle title="最近の活動" />
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <ul className="space-y-3">
                {MOCK_ACTIVITIES.map((activity) => (
                    <li key={activity.id}>
                        <a href={activity.link} className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                            <p className="text-gray-700 text-sm">{activity.text}</p>
                            <ChevronRight size={18} className="text-gray-400 ml-2" />
                        </a>
                    </li>
                ))}
            </ul>
            <div className="text-right mt-4 pt-3 border-t border-gray-100">
                <a href="/notifications" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition">
                    すべて見る →
                </a>
            </div>
        </div>

        {/* 4. おすすめセクション */}
        <SectionTitle title="似た価値観のユーザー" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {MOCK_RECOMMENDED_USERS.map((user) => (
                <UserRecommendationCard key={user.id} user={user} />
            ))}
        </div>

        <SectionTitle title="あなたにおすすめの作品" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {MOCK_RECOMMENDED_WORKS.map((work) => (
                <WorkRecommendationCard key={work.id} work={work} />
            ))}
        </div>
    </main>
);

/**
 * クイックアクションボタン
 */
const QuickActionButton = ({ icon, label, href, color }) => {
    const colorClasses = {
        indigo: "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500",
        emerald: "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500",
        fuchsia: "bg-fuchsia-500 hover:bg-fuchsia-600 focus:ring-fuchsia-500",
    }[color] || "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500";

    return (
        <a
            href={href}
            className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl text-white font-bold shadow-xl transition duration-300 transform hover:scale-[1.02]
        ${colorClasses} focus:outline-none focus:ring-4 focus:ring-opacity-50`}
        >
            <span className="text-4xl mb-2">{icon}</span>
            <span className="text-lg text-center">{label}</span>
        </a>
    );
};

/**
 * フッターコンポーネント
 */
const Footer = () => (
    <footer className="w-full bg-white border-t border-gray-100 p-4 sm:p-6 text-xs text-gray-500 text-center">
        <div className="flex justify-center space-x-4 mb-2">
            <a href="/terms" className="hover:text-indigo-600 transition">利用規約</a>
            <span className="text-gray-300">|</span>
            <a href="/privacy" className="hover:text-indigo-600 transition">プライバシーポリシー</a>
            <span className="text-gray-300">|</span>
            <a href="/help" className="hover:text-indigo-600 transition">ヘルプ</a>
        </div>
        <p>© 2025 VNS masakinihirota</p>
    </footer>
);


// ==============================================================================
// 4. Main App Component
// ==============================================================================

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Bodyにpadding-topを設定してヘッダーとの重なりを回避
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <style jsx global>{`
        body {
          padding-top: 4rem; /* ヘッダーの高さ (64px) に相当 */
        }
      `}</style>

            {/* ヘッダー */}
            <Header
                notificationCount={MOCK_USER.notification_count}
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
            />

            <div className="flex flex-1">
                {/* サイドバー */}
                <div className="hidden sm:block">
                    <Sidebar isMenuOpen={false} onMenuClose={() => { }} />
                </div>

                {/* モバイル用メニュー */}
                <Sidebar
                    isMenuOpen={isMenuOpen}
                    onMenuClose={() => setIsMenuOpen(false)}
                />

                {/* メインコンテンツエリア */}
                <div className="flex flex-1 overflow-y-auto">
                    <MainContent />
                </div>
            </div>

            {/* フッター */}
            <Footer />
        </div>
    );
};

export default App;
