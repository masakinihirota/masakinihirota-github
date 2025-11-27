"use client";
import React, { useState, useMemo } from 'react';
import { User, Edit, Heart, ChevronRight, Briefcase, Users, Zap, BookOpen, Layers, Aperture } from 'lucide-react';

// --- モックデータ定義 (Supabase/Drizzleからの取得をシミュレート) ---

/** @typedef {'now' | 'life' | 'future'} WorkStatus */
/** @typedef {1 | 2 | 3} WorkTier */
/** @typedef {0 | 1 | 2 | 3 | 4 | 5} SkillLevel */

const mockProfile = {
    id: 'user-a1b2c3d4',
    name: '田中 太郎',
    bio: '誠実さと創造性を大切にしています。Web開発とデザインが得意です。次の目標は、価値観ベースのコミュニティを構築することです。',
    purpose: '仕事',
    role: 'リーダー',
    type: '本人（匿名）',
    isMyProfile: false, // trueにすると「編集」ボタン、falseにすると「フォロー」ボタンが表示されます
    profileImageUrl: 'https://placehold.co/120x120/1d4ed8/ffffff?text=TK',
};

const mockWorks = [
    { id: 1, title: '価値観マッチングアプリ', image: 'https://placehold.co/200x120/10b981/ffffff?text=Work+1', tier: 1, status: '人生', claps: 5, liked: true },
    { id: 2, title: '週末ハッカソンプロジェクト', image: 'https://placehold.co/200x120/f59e0b/ffffff?text=Work+2', tier: 2, status: '今', claps: 2, liked: false },
    { id: 3, title: '未来の教育システム構想', image: 'https://placehold.co/200x120/3b82f6/ffffff?text=Work+3', tier: 3, status: '未来', claps: 0, liked: false },
    { id: 4, title: '個人ポートフォリオサイト', image: 'https://placehold.co/200x120/ef4444/ffffff?text=Work+4', tier: 2, status: '今', claps: 10, liked: true },
    { id: 5, title: '趣味のイラスト集', image: 'https://placehold.co/200x120/6366f1/ffffff?text=Work+5', tier: 1, status: '人生', claps: 7, liked: false },
];

const mockValues = [
    { question: '好きな食べ物', answer: 'ラーメン' },
    { question: '趣味', answer: 'ゲーム、読書' },
    { question: '大切にしていること', answer: '誠実さ、創造性' },
    { question: '将来の夢', answer: '世界中の人と価値観でつながる' },
    { question: '好きな場所', answer: '海が見えるカフェ' },
    { question: 'モットー', answer: 'まずはやってみる' },
];

const mockSkills = [
    { name: 'JavaScript', level: 4 }, // 80%
    { name: 'ライティング', level: 3 }, // 60%
    { name: 'デザイン', level: 2 }, // 40%
    { name: 'プロジェクト管理', level: 4 }, // 80%
    { name: 'コミュニケーション', level: 5 }, // 100%
];

const mockOrganizations = [
    { id: 1, name: '未来創造ラボ', icon: 'https://placehold.co/50x50/dc2626/ffffff?text=ML', role: 'リーダー' },
    { id: 2, name: '週末エンジニアリング部', icon: 'https://placehold.co/50x50/4f46e5/ffffff?text=WE', role: 'メンバー' },
    { id: 3, name: '地域コミュニティ運営', icon: 'https://placehold.co/50x50/14b8a6/ffffff?text=CC', role: 'メンバー' },
];

// --- ユーティリティ関数 ---

/** スキルレベル (0-5) をプログレスバーのパーセンテージと色に変換 */
const getSkillProgress = (level) => {
    const percent = (level / 5) * 100;
    let color = 'bg-blue-500';
    if (level >= 5) color = 'bg-green-500';
    else if (level >= 4) color = 'bg-yellow-500';
    return { percent, color };
};

/**
 * 共通ヘッダーコンポーネントのプレースホルダー
 */
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm p-4 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-700">ValueConnect</div>
        <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-gray-600">検索</div>
            <User className="w-6 h-6 text-gray-600" />
            <div className="text-gray-600">通知</div>
            <div className="text-gray-600">設定</div>
        </div>
    </header>
);

/**
 * 共通サイドバーコンポーネントのプレースホルダー
 */
const Sidebar = () => (
    <nav className="hidden lg:block w-64 min-h-screen bg-white border-r border-gray-200 pt-20 p-4">
        <ul className="space-y-3">
            <li className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">HOME</span>
            </li>
            <li className="p-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold cursor-pointer flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span>プロフィール</span>
            </li>
            <li className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">組織</span>
            </li>
        </ul>
    </nav>
);

/**
 * 各セクションの見出しコンポーネント
 */
const SectionHeader = ({ title }) => (
    <div className="mb-6 pt-4 border-t-2 border-indigo-200">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">{title}</h2>
    </div>
);

/**
 * プロフィール詳細カード
 */
const ProfileCard = ({ profile, onEdit, onFollow, isFollowing }) => {
    const FollowButton = () => {
        const [following, setFollowing] = useState(isFollowing);

        const handleClick = () => {
            // フォロー/ウォッチ実行のロジックをシミュレート
            setFollowing(!following);
            onFollow(profile.id, !following);
        };

        return (
            <button
                onClick={handleClick}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 rounded-full font-bold transition-all duration-200 ${following
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-300'
                    }`}
            >
                <Heart className="w-5 h-5" fill={following ? 'rgb(55 65 81)' : 'white'} />
                <span>{following ? 'フォロー中' : 'フォロー'}</span>
            </button>
        );
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
                {/* プロフィール画像 */}
                <img
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-indigo-500/50"
                    src={profile.profileImageUrl}
                    alt={profile.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x120/1d4ed8/ffffff?text=User" }}
                />

                <div className="flex-1 min-w-0">
                    {/* 名前 */}
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 truncate">{profile.name}</h1>

                    {/* 自己紹介 */}
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">{profile.bio}</p>

                    {/* 詳細情報 */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-indigo-500" />
                            <span>目的: {profile.purpose}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Layers className="w-4 h-4 text-indigo-500" />
                            <span>役割: {profile.role === 'リーダー' ? 'リーダー' : 'メンバー'}</span>
                        </div>
                        <div className="flex items-center space-x-2 col-span-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>種類: {profile.type}</span>
                        </div>
                    </div>
                </div>

                {/* ボタンエリア */}
                <div className="w-full sm:w-auto sm:self-start pt-2">
                    {profile.isMyProfile ? (
                        <button
                            onClick={onEdit}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 rounded-full bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all duration-200 shadow-lg shadow-pink-300"
                        >
                            <Edit className="w-5 h-5" />
                            <span>プロフィール編集</span>
                        </button>
                    ) : (
                        <FollowButton />
                    )}
                </div>
            </div>
        </div>
    );
};


/**
 * 登録作品セクション
 */
const WorkSection = ({ works }) => {
    // 最大3件表示に制限
    const displayWorks = works.slice(0, 3);

    /**
     * 作品カードコンポーネント
     */
    const WorkCard = ({ work }) => (
        <div
            className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => console.log(`作品詳細へ遷移: ${work.title}`)}
        >
            <img
                src={work.image}
                alt={work.title}
                className="w-full h-32 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x120/6b7280/ffffff?text=No+Image" }}
            />
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{work.title}</h3>
                <p className="text-sm text-gray-500">Tier {work.tier}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${work.status === '人生' ? 'bg-indigo-100 text-indigo-800' : work.status === '今' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        状態:{work.status}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-pink-600">
                        <span role="img" aria-label="claps">👏</span>
                        <span>{work.claps}拍手</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section>
            <SectionHeader title="【登録作品】" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayWorks.map((work) => (
                    <WorkCard key={work.id} work={work} />
                ))}
            </div>
            {works.length > 3 && (
                <MoreLink text="もっと見る" onClick={() => console.log('作品一覧へ遷移')} />
            )}
        </section>
    );
};

/**
 * 価値観セクション
 */
const ValueSection = ({ values }) => {
    // 最大5件表示に制限
    const displayValues = values.slice(0, 5);

    return (
        <section>
            <SectionHeader title="【価値観】" />
            <ul className="space-y-3 text-gray-700">
                {displayValues.map((v, index) => (
                    <li key={index} className="flex items-start space-x-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">{v.question}: </span>
                            <span>{v.answer}</span>
                        </div>
                    </li>
                ))}
            </ul>
            {values.length > 5 && (
                <MoreLink text="もっと見る" onClick={() => console.log('価値観一覧へ遷移')} />
            )}
        </section>
    );
};

/**
 * スキルセクション
 */
const SkillSection = ({ skills }) => {
    // 最大5件表示に制限
    const displaySkills = skills.slice(0, 5);

    /**
     * スキルプログレスバーコンポーネント
     */
    const SkillItem = ({ skill }) => {
        const { percent, color } = getSkillProgress(skill.level);
        const lvText = `Lv.${skill.level}`;

        // プログレスバーのブロック表示用 (Lv.5なら█████)
        const blocks = Array(5).fill('░').map((block, index) => (
            <span key={index} className={`font-mono text-xl ${index < skill.level ? 'text-indigo-600' : 'text-gray-300'}`}>
                █
            </span>
        ));

        return (
            <div className="py-2">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">{skill.name} ({lvText})</span>
                    <span className="text-sm font-mono text-gray-600">{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${color} transition-all duration-700`}
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <section>
            <SectionHeader title="【スキル】" />
            <div className="space-y-2">
                {displaySkills.map((skill, index) => (
                    <SkillItem key={index} skill={skill} />
                ))}
            </div>
            {skills.length > 5 && (
                <MoreLink text="もっと見る" onClick={() => console.log('スキル一覧へ遷移')} />
            )}
        </section>
    );
};

/**
 * 所属組織セクション
 */
const OrganizationSection = ({ organizations }) => {
    // 最大3件表示に制限 (PC/Tablet/Mobileで調整)
    const displayOrgs = organizations.slice(0, 3);

    /**
     * 組織カードコンポーネント
     */
    const OrganizationCard = ({ org }) => (
        <div
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => console.log(`組織詳細へ遷移: ${org.name}`)}
        >
            <div className="flex items-center space-x-3">
                <img
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-300"
                    src={org.icon}
                    alt={org.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/50x50/6b7280/ffffff?text=Org" }}
                />
                <div>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{org.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                        <Aperture className="w-4 h-4 text-indigo-500" />
                        <span>役割: {org.role}</span>
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <section>
            <SectionHeader title="【所属組織】" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayOrgs.map((org) => (
                    <OrganizationCard key={org.id} org={org} />
                ))}
            </div>
            {organizations.length > 3 && (
                <MoreLink text="もっと見る" onClick={() => console.log('組織一覧へ遷移')} />
            )}
        </section>
    );
};

/**
 * 「もっと見る」リンクコンポーネント
 */
const MoreLink = ({ text, onClick }) => (
    <div className="mt-6 text-right">
        <button
            onClick={onClick}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center justify-end space-x-1 transition-colors duration-200"
        >
            <span>{text}</span>
            <ChevronRight className="w-5 h-5" />
        </button>
    </div>
);


/**
 * メインアプリケーションコンポーネント
 */
export default function App() {
    const [profileData, setProfileData] = useState(mockProfile);
    const [works, setWorks] = useState(mockWorks);
    const [values, setValues] = useState(mockValues);
    const [skills, setSkills] = useState(mockSkills);
    const [organizations, setOrganizations] = useState(mockOrganizations);
    const [isFollowing, setIsFollowing] = useState(true); // モックでフォロー状態を保持

    // 編集ボタンクリックハンドラ (自分のプロフィールの場合)
    const handleEdit = () => {
        console.log('ユーザープロフィール編集画面へ遷移');
        // Next.jsのrouter.push('/profiles/edit') 相当
    };

    // フォローボタンクリックハンドラ (他人のプロフィールの場合)
    const handleFollow = (profileId, newFollowingState) => {
        console.log(`プロフィールID: ${profileId} をフォロー状態: ${newFollowingState} に変更`);
        setIsFollowing(newFollowingState);
        // APIコール: Supabase function call
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="flex pt-16"> {/* ヘッダーの高さ分のパディング */}
                {/* サイドバー (PCのみ表示) */}
                <Sidebar />

                {/* メインコンテンツエリア */}
                <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
                    <div className="w-full">

                        {/* 1. プロフィール情報カード */}
                        <ProfileCard
                            profile={profileData}
                            onEdit={handleEdit}
                            onFollow={handleFollow}
                            isFollowing={isFollowing}
                        />

                        {/* 2. 登録作品セクション */}
                        <WorkSection works={works} />

                        {/* 3. 価値観セクション */}
                        <div className="mt-12">
                            <ValueSection values={values} />
                        </div>

                        {/* 4. スキルセクション */}
                        <div className="mt-12">
                            <SkillSection skills={skills} />
                        </div>

                        {/* 5. 所属組織セクション */}
                        <div className="mt-12">
                            <OrganizationSection organizations={organizations} />
                        </div>

                        {/* フッターエリアのプレースホルダー */}
                        <footer className="mt-20 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                            <p>© 2024 ValueConnect. All rights reserved.</p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
