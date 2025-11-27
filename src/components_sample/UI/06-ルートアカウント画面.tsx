"use client";
import React, { useState, useMemo, useCallback } from 'react';
import {
    User,
    MapPin,
    Globe,
    Clock,
    Briefcase,
    Gamepad2,
    Trophy,
    Lock,
    Settings,
    Wallet,
    Plus,
    ArrowRight,
    X,
    Menu,
    Microscope // Added for mock data
} from 'lucide-react';

// --- Mock Data (Based on schema reference) ---
const mockRootAccount = {
    id: 'root-123',
    displayName: 'デジタルガーディアン',
    location: 'アジア', // 居住地: 地球3分割
    nativeLanguage: '日本語', // 母語
    birthGeneration: '1980年代', // 生誕世代
    pointBalance: 1000,
    plan: 'free', // 'free' or 'premium'
};

const mockProfiles = [
    { id: 'p1', name: '仕事用ペルソナ', purpose: '仕事', role: 'リーダー', icon: 'Briefcase' },
    { id: 'p2', name: '趣味用アカウント', purpose: '遊び', role: 'メンバー', icon: 'Gamepad2' },
    { id: 'p3', name: '匿名リサーチ', purpose: '調査', role: 'メンバー', icon: 'Microscope' },
];

const mockAchievements = [
    { id: 'a1', name: '初陣', description: '初組織作成', achieved: true, date: '2025/01/15', icon: 'Trophy' },
    { id: 'a2', name: '人気者', description: 'メンバー10人達成', achieved: true, date: '2025/02/10', icon: 'Trophy' },
    { id: 'a3', name: 'エキスパート', description: '特定のスキルレベルMax', achieved: false, date: null, icon: 'Lock' },
    { id: 'a4', name: '旅人', description: '3つの地域を巡る', achieved: false, date: null, icon: 'Lock' },
];

const MAX_FREE_PROFILES = 10;
const MAX_PREMIUM_PROFILES = 30;

// Helper to map icon names to Lucide components
const IconMap = { Briefcase, Gamepad2, Microscope, Trophy, Lock, User, Wallet, MapPin, Globe, Clock, Plus, ArrowRight, Settings, X, Menu };

const DynamicIcon = ({ name, className }) => {
    const IconComponent = IconMap[name] || User;
    return <IconComponent className={className} />;
};

// --- Common Components (Mock) ---

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">プロジェクトロゴ</div>
        <div className="flex items-center space-x-4">
            <span className="text-sm hidden sm:inline">検索 | 通知</span>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <User size={20} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors hidden md:block">
                <Settings size={20} />
            </button>
            <button className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Menu size={20} />
            </button>
        </div>
    </header>
);

const Sidebar = () => (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-100 p-6 fixed top-[65px] left-0 h-[calc(100vh-65px)]">
        <nav className="space-y-2">
            <div className="font-semibold text-gray-700 mb-4">ナビゲーション</div>
            <a href="#" className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-600 font-medium transition-colors">
                <User className="mr-3" size={20} />
                ルートアカウント (選択中)
            </a>
            <a href="#" className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Briefcase className="mr-3" size={20} />
                組織管理
            </a>
            <a href="#" className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Wallet className="mr-3" size={20} />
                ポイント
            </a>
        </nav>
    </aside>
);

const Footer = () => (
    <footer className="w-full bg-gray-50 text-center py-4 text-xs text-gray-500 border-t border-gray-200 mt-12">
        © 2025 All Rights Reserved. | プライバシーポリシー | 利用規約
    </footer>
);

// --- Main Content Components ---

const RootAccountCard = ({ account }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ルートアカウント情報</h2>
        <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={32} />
            </div>
            <div>
                <div className="text-2xl font-extrabold text-gray-900">{account.displayName}</div>
                <div className="text-sm text-gray-500">ルートアカウントID: {account.id}</div>
            </div>
        </div>

        <div className="space-y-2 text-gray-700 text-sm mb-6 border-t pt-4">
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" /> 居住地: <span className="ml-2 font-medium">{account.location}</span></div>
            <div className="flex items-center"><Globe className="w-4 h-4 mr-2 text-blue-500" /> 母語: <span className="ml-2 font-medium">{account.nativeLanguage}</span></div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /> 生誕世代: <span className="ml-2 font-medium">{account.birthGeneration}</span></div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg flex justify-between items-center mb-6">
            <div className="font-semibold text-lg text-gray-800 flex items-center">
                <Wallet className="w-6 h-6 mr-3 text-yellow-600" />
                ポイント残高: <span className="ml-2 text-2xl font-extrabold text-yellow-700">{account.pointBalance.toLocaleString()} pt</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm transition-colors">
                ポイント履歴を見る <ArrowRight size={16} className="ml-1" />
            </button>
        </div>

        <div className="flex space-x-4">
            <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center">
                <Settings size={18} className="mr-2" />
                設定
            </button>
        </div>
    </div>
);

const ProfileCard = ({ profile }) => (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between h-full">
        <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                <DynamicIcon name={profile.icon} size={20} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 truncate">{profile.name}</h4>
        </div>
        <div className="text-sm text-gray-600 space-y-1 mb-4">
            <p><span className="font-medium text-gray-500">目的:</span> {profile.purpose}</p>
            <p><span className="font-medium text-gray-500">役割:</span> <span className={`font-bold ${profile.role === 'リーダー' ? 'text-red-500' : 'text-green-500'}`}>{profile.role}</span></p>
        </div>
        <div className="flex space-x-2 border-t pt-3">
            <button className="flex-1 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                詳細を見る
            </button>
            <button className="flex-1 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                編集
            </button>
        </div>
    </div>
);

const UserProfilesSection = ({ profiles, openLimitModal }) => {
    const isPremium = mockRootAccount.plan === 'premium';
    const maxProfiles = isPremium ? MAX_PREMIUM_PROFILES : MAX_FREE_PROFILES;
    const currentCount = profiles.length;
    const canCreate = currentCount < maxProfiles;

    const handleCreateProfile = () => {
        if (!canCreate) {
            openLimitModal();
        } else {
            console.log('ユーザープロフィール作成画面へ遷移');
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-extrabold text-gray-800 border-b-4 border-blue-500 inline-block pb-1 mb-6">
                ユーザープロフィール一覧
            </h3>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">
                    {currentCount}/{maxProfiles} プロフィール
                    ({isPremium ? '有料プラン' : '無料プラン'})
                </div>
                <button
                    onClick={handleCreateProfile}
                    className={`px-4 py-2 rounded-lg font-bold text-white transition-all shadow-md ${canCreate
                        ? 'bg-green-600 hover:bg-green-700 active:shadow-none'
                        : 'bg-gray-400 cursor-not-allowed'
                        } flex items-center`}
                >
                    <Plus size={18} className="mr-1" />
                    新しいプロフィールを作成
                </button>
            </div>

            {currentCount === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-500">
                    まだプロフィールがありません。
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map(profile => (
                    <ProfileCard key={profile.id} profile={profile} />
                ))}
            </div>
        </div>
    );
};

const AchievementsSection = ({ achievements }) => {
    const displayedAchievements = achievements.slice(0, 4); // Display top 4

    return (
        <div>
            <h3 className="text-xl font-extrabold text-gray-800 border-b-4 border-purple-500 inline-block pb-1 mb-6">
                アチーブメント
            </h3>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <ul className="space-y-4 mb-4">
                    {displayedAchievements.map(a => (
                        <li key={a.id} className="flex items-center text-gray-700">
                            <DynamicIcon name={a.icon} size={20} className={`mr-3 ${a.achieved ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <span className={`font-medium ${a.achieved ? 'text-gray-800' : 'text-gray-500 italic'}`}>
                                {a.achieved ? `${a.name} (${a.description})` : '未取得のアチーブメント...'}
                            </span>
                            {a.achieved && <span className="ml-auto text-xs text-gray-500">取得日: {a.date}</span>}
                        </li>
                    ))}
                </ul>
                <div className="text-right border-t pt-4">
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-end">
                        すべて見る <ArrowRight size={16} className="ml-1" />
                    </a>
                </div>
            </div>
        </div>
    );
};

const LimitExceededModal = ({ isPremium, maxFree, maxPremium, onClose }) => {
    const max = isPremium ? maxPremium : maxFree;
    const planName = isPremium ? '有料プラン' : '無料プラン';
    const limitText = isPremium ? `${maxPremium}個` : `${maxFree}個`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h4 className="text-xl font-bold text-red-600 flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        プロフィール作成の上限に達しました
                    </h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="text-gray-700 space-y-3 mb-6">
                    <p>
                        現在の<span className="font-bold">{planName}</span>では、プロフィールを<span className="font-bold text-red-600">{limitText}</span>まで作成できます。
                    </p>
                    <p>
                        {isPremium
                            ? 'これ以上の作成には、アカウント管理者にプランの見直しを依頼してください。'
                            : `有料プランにアップグレードすると、最大${maxPremium}個まで作成可能です。`
                        }
                    </p>
                </div>
                <div className="flex justify-end space-x-3">
                    {!isPremium && (
                        <button
                            onClick={() => { console.log('有料プランを見る'); onClose(); }}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            有料プランを見る
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

const App = () => {
    const [showLimitModal, setShowLimitModal] = useState(false);

    const openLimitModal = useCallback(() => setShowLimitModal(true), []);
    const closeLimitModal = useCallback(() => setShowLimitModal(false), []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="flex pt-[65px]"> {/* Padding top for fixed header */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">
                            ルートアカウント: {mockRootAccount.displayName}
                        </h1>

                        {/* Root Account Information Card */}
                        <RootAccountCard account={mockRootAccount} />

                        {/* User Profiles List Section */}
                        <UserProfilesSection
                            profiles={mockProfiles}
                            openLimitModal={openLimitModal}
                        />

                        {/* Achievements Section */}
                        <AchievementsSection achievements={mockAchievements} />
                    </div>
                </main>
            </div>

            <Footer />

            {/* Limit Exceeded Modal (Error Handling) */}
            {showLimitModal && (
                <LimitExceededModal
                    isPremium={mockRootAccount.plan === 'premium'}
                    maxFree={MAX_FREE_PROFILES}
                    maxPremium={MAX_PREMIUM_PROFILES}
                    onClose={closeLimitModal}
                />
            )}
        </div>
    );
};

export default App;
