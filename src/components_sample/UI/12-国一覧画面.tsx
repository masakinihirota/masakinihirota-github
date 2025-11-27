"use client";
import React, { useState, useMemo, useCallback } from 'react';

// 国のレベル定義
type NationLevel = 'Village' | 'Town' | 'City' | 'Metropolis';
type LifeCycleStage = 'preparing' | 'active' | 'extinct' | 'reviving';

// 国データの型定義
interface Nation {
    id: string;
    name: string;
    description: string;
    level: NationLevel;
    population: number;
    maintenance_fee: number;
    lifecycle_stage: LifeCycleStage;
    created_at: string; // YYYY/MM/DD
    is_member: boolean; // ユーザーがすでに加入済みかどうか
}

// モックデータ (28件をシミュレーション)
const mockNations: Nation[] = [
    { id: 'n001', name: 'エルドラド', description: '多様な価値観を持つ人々が共生するコミュニティです。', level: 'City', population: 520, maintenance_fee: 100, lifecycle_stage: 'active', created_at: '2023/05/15', is_member: false },
    { id: 'n002', name: 'ファンタジア', description: 'ファンタジー作品を愛する国です。古き良き文化を継承しています。', level: 'Town', population: 180, maintenance_fee: 50, lifecycle_stage: 'active', created_at: '2024/02/20', is_member: false },
    { id: 'n003', name: 'サイバーネティクス', description: 'AIとテクノロジーが支配する、未来都市です。', level: 'Metropolis', population: 1200, maintenance_fee: 500, lifecycle_stage: 'active', created_at: '2022/11/01', is_member: false },
    { id: 'n004', name: 'グリーンヒル', description: '自然と共存する、穏やかな田舎の村。初心者歓迎！', level: 'Village', population: 45, maintenance_fee: 10, lifecycle_stage: 'active', created_at: '2024/06/10', is_member: false },
    { id: 'n005', name: 'アカデミア', description: '知識と学問を追求する研究者たちの集まり。', level: 'City', population: 310, maintenance_fee: 120, lifecycle_stage: 'active', created_at: '2023/08/25', is_member: true }, // 加入済み
    { id: 'n006', name: 'トレジャーアイランド', description: '宝探しをテーマにした、活気あふれる海賊の国。', level: 'Town', population: 250, maintenance_fee: 75, lifecycle_stage: 'active', created_at: '2023/10/01', is_member: false },
    { id: 'n007', name: 'ザ・ウォール', description: '厳格なルールで守られた、規律正しい国。', level: 'Metropolis', population: 980, maintenance_fee: 400, lifecycle_stage: 'active', created_at: '2022/07/19', is_member: false },
    { id: 'n008', name: 'ポエムの里', description: '詩と芸術を愛する小さな村。', level: 'Village', population: 30, maintenance_fee: 5, lifecycle_stage: 'active', created_at: '2024/07/15', is_member: false },
    { id: 'n009', name: 'ネオ・トウキョウ', description: 'アジア最大の仮想都市。経済活動が活発。', level: 'Metropolis', population: 1500, maintenance_fee: 700, lifecycle_stage: 'active', created_at: '2022/01/01', is_member: false },
    { id: 'n010', name: 'パストラル', description: '滅亡から復興中の、美しい農村地帯。', level: 'Village', population: 10, maintenance_fee: 20, lifecycle_stage: 'reviving', created_at: '2024/09/01', is_member: false },
    { id: 'n011', name: 'オアシス', description: '砂漠の中にある、資源豊かな独立国。', level: 'Town', population: 210, maintenance_fee: 60, lifecycle_stage: 'active', created_at: '2023/04/18', is_member: false },
    { id: 'n012', name: 'ミッドナイト', description: '夜型の住人が集まる、ダークテーマの都市。', level: 'City', population: 450, maintenance_fee: 150, lifecycle_stage: 'active', created_at: '2023/02/14', is_member: false },
    { id: 'n013', name: 'パイオニア', description: '新しい技術とアイデアを試すための実験国家。', level: 'Town', population: 150, maintenance_fee: 80, lifecycle_stage: 'active', created_at: '2024/03/12', is_member: false },
    { id: 'n014', name: 'アトランティス', description: '伝説の海上都市を再現するプロジェクト。準備中。', level: 'Metropolis', population: 0, maintenance_fee: 1000, lifecycle_stage: 'preparing', created_at: '2025/01/01', is_member: false },
    { id: 'n015', name: 'ロスト・キングダム', description: 'かつて栄華を極めたが、現在は滅亡した国。', level: 'Metropolis', population: 0, maintenance_fee: 0, lifecycle_stage: 'extinct', created_at: '2020/01/01', is_member: false },
    // さらにモックデータを追加 (合計28件)
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `n${i + 16}`,
        name: `国${i + 16}`,
        description: `ジェネレートされたモックデータ国 ${i + 16}。`,
        level: (['Village', 'Town', 'City', 'Metropolis'] as NationLevel)[i % 4],
        population: 100 + (i * 50),
        maintenance_fee: 20 + (i * 10),
        lifecycle_stage: 'active' as LifeCycleStage,
        created_at: `2024/0${(i % 9) + 1}/01`,
        is_member: false,
    })),
];

// 表示用の定数とユーティリティ
const ITEMS_PER_PAGE = 20;

const levelOptions: { value: NationLevel | 'all', label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'Village', label: 'Village (村)' },
    { value: 'Town', label: 'Town (町)' },
    { value: 'City', label: 'City (都市)' },
    { value: 'Metropolis', label: 'Metropolis (大都市)' },
];

const sortOptions: { value: string, label: string }[] = [
    { value: 'newest', label: '新着順' },
    { value: 'population', label: '人口数順' },
    { value: 'level', label: 'レベル順' },
    { value: 'name', label: '国名順' },
];

const getLevelDisplay = (level: NationLevel): { text: string, icon: string, color: string } => {
    switch (level) {
        case 'Village': return { text: 'Village (村)', icon: '🏡', color: 'text-green-600' };
        case 'Town': return { text: 'Town (町)', icon: '🏘️', color: 'text-yellow-600' };
        case 'City': return { text: 'City (都市)', icon: '🏙️', color: 'text-orange-600' };
        case 'Metropolis': return { text: 'Metropolis (大都市)', icon: '🗼', color: 'text-red-600' };
    }
};

const getStageDisplay = (stage: LifeCycleStage): string => {
    switch (stage) {
        case 'active': return '運営中';
        case 'preparing': return '準備中';
        case 'extinct': return '滅亡';
        case 'reviving': return '復興中';
        default: return '不明';
    }
};

// ヘッダーコンポーネントのプレースホルダー
const Header = () => (
    <header className="bg-white shadow-md p-4 flex items-center justify-between z-10 sticky top-0">
        <div className="text-xl font-bold text-gray-800">NextNation 🌐</div>
        <div className="flex space-x-4">
            <button className="text-sm text-gray-600 hover:text-blue-500 hidden sm:block">通知</button>
            <button className="text-sm text-gray-600 hover:text-blue-500">プロフィール</button>
        </div>
    </header>
);

// サイドバーコンポーネントのプレースホルダー
const Sidebar = ({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) => (
    <nav className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 bg-gray-50 p-4 border-r transition-transform duration-300 ease-in-out z-20 lg:z-0`}>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">ナビゲーション</h2>
        <ul className="space-y-2">
            <li className="p-2 rounded-lg hover:bg-gray-200">
                <a href="/home" className="flex items-center text-gray-700">🏠 HOME</a>
            </li>
            <li className="p-2 rounded-lg bg-blue-100 text-blue-700 font-bold border-l-4 border-blue-500">
                <a href="/nations" className="flex items-center">🌍 国</a>
            </li>
            <li className="p-2 rounded-lg hover:bg-gray-200">
                <a href="/user" className="flex items-center text-gray-700">👤 マイページ</a>
            </li>
        </ul>
    </nav>
);

// 国カードコンポーネント
const NationCard: React.FC<{ nation: Nation, onApply: (nation: Nation) => void }> = ({ nation, onApply }) => {
    const levelInfo = getLevelDisplay(nation.level);
    const stageDisplay = getStageDisplay(nation.lifecycle_stage);

    // 状態が「運営中」かつ未加入の場合のみ申請ボタンを表示
    const showApplyButton = nation.lifecycle_stage === 'active' && !nation.is_member;
    const showJoinedBadge = nation.is_member;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100 flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 truncate">{nation.name}</h3>

                {/* レベル・人口・維持費のグリッド表示 */}
                <div className="grid grid-cols-2 gap-y-1 mb-4 text-sm sm:text-base">
                    <p className="font-semibold text-gray-600">レベル:</p>
                    <p className={`${levelInfo.color} font-bold`}>{levelInfo.icon} {levelInfo.text}</p>

                    <p className="font-semibold text-gray-600">人口:</p>
                    <p className="text-gray-800">{nation.population.toLocaleString()}人</p>

                    <p className="font-semibold text-gray-600">維持費:</p>
                    <p className="text-gray-800">{nation.maintenance_fee.toLocaleString()}pt/月</p>

                    <p className="font-semibold text-gray-600">状態:</p>
                    <p className="text-gray-800">{stageDisplay} {nation.lifecycle_stage === 'active' ? `(since ${nation.created_at.substring(0, 7)})` : ''}</p>
                </div>

                {/* 説明文 */}
                <p className="text-gray-700 text-sm italic mb-4 line-clamp-2">
                    説明: {nation.description}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 border-t border-gray-100">
                {showJoinedBadge && (
                    <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        ✅ 加入済み
                    </span>
                )}
                <button
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
                    onClick={() => console.log(`Navigating to nation ${nation.id} details`)}
                >
                    詳細を見る
                </button>
                {showApplyButton && (
                    <button
                        className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
                        onClick={() => onApply(nation)}
                    >
                        加入申請
                    </button>
                )}
            </div>
        </div>
    );
};

// ページネーションコンポーネント
const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = useMemo(() => {
        const pages: (number | '...')[] = [];
        const maxPagesToShow = 5; // 中央に表示する最大のページ数

        if (totalPages <= maxPagesToShow + 2) {
            // ページ数が少ない場合
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // ページ数が多い場合 (1 ... current-1, current, current+1 ... total)
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage === 1) endPage = Math.min(totalPages - 1, 3);
            if (currentPage === totalPages) startPage = Math.max(2, totalPages - 3);

            if (startPage > 2) pages.push('...');

            for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== totalPages) pages.push(i);
            }

            if (endPage < totalPages - 1) pages.push('...');

            if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    const buttonClass = (isActive: boolean) =>
        `px-3 py-1 rounded-full text-sm font-medium transition ${isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <div className="flex justify-center items-center space-x-2 p-4 mt-4">
            <button
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <span className="text-lg">←</span>
                <span>前へ</span>
            </button>

            {pageNumbers.map((page, index) => (
                page === '...' ? (
                    <span key={index} className="px-3 py-1 text-gray-500">...</span>
                ) : (
                    <button
                        key={index}
                        className={buttonClass(page === currentPage)}
                        onClick={() => onPageChange(page as number)}
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span>次へ</span>
                <span className="text-lg">→</span>
            </button>
        </div>
    );
};


// メインアプリケーションコンポーネント
export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<NationLevel | 'all'>('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [modalNation, setModalNation] = useState<Nation | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

    // レベルのソート優先度マップ
    const levelOrder: Record<NationLevel, number> = {
        'Metropolis': 4,
        'City': 3,
        'Town': 2,
        'Village': 1,
    };

    // フィルタリングとソートのロジック
    const filteredAndSortedNations = useMemo(() => {
        let result = mockNations;

        // 1. フィルタリング
        if (searchQuery) {
            result = result.filter(nation =>
                nation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                nation.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedLevel !== 'all') {
            result = result.filter(nation => nation.level === selectedLevel);
        }

        // 2. ソート
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'population':
                    return b.population - a.population;
                case 'level':
                    return levelOrder[b.level] - levelOrder[a.level];
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [searchQuery, selectedLevel, sortBy]);

    // ページネーションの計算
    const totalItems = filteredAndSortedNations.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // 現在のページに表示するデータ
    const currentNations = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredAndSortedNations.slice(start, end);
    }, [filteredAndSortedNations, currentPage]);

    // ページ変更ハンドラ
    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // スクロールをトップに戻す（UX向上）
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [totalPages]);

    // 加入申請モーダル表示ハンドラ
    const handleApplyClick = (nation: Nation) => {
        setModalNation(nation);
        setFeedbackMessage(null); // メッセージをリセット
    };

    // 加入申請実行ハンドラ
    const handleConfirmApply = () => {
        if (!modalNation) return;

        // ユーザーポイントシミュレーション (ここでは200ptと仮定)
        const userPoints = 200;

        // ポイント不足のシミュレーション
        if (userPoints < modalNation.maintenance_fee) {
            setFeedbackMessage({
                type: 'warning',
                text: `⚠️ ポイントが不足しています。維持費: ${modalNation.maintenance_fee}pt必要`
            });
            // 申請完了ではなく、モーダルを維持し警告を表示
            return;
        }

        // 申請成功のシミュレーション
        console.log(`Applying to nation: ${modalNation.name}`);

        // 実際にAPIを叩く処理（Supabaseのnation_membershipsテーブルに登録）
        // ...

        setFeedbackMessage({
            type: 'success',
            text: '✅ 加入申請を送信しました!'
        });
        setModalNation(null); // モーダルを閉じる

        // 成功メッセージは一定時間後に消す
        setTimeout(() => setFeedbackMessage(null), 5000);
    };

    // フィードバックメッセージのUI
    const FeedbackAlert: React.FC<{ message: typeof feedbackMessage }> = ({ message }) => {
        if (!message) return null;

        let bgColor = '';
        let textColor = '';
        let borderColor = '';

        switch (message.type) {
            case 'success':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                borderColor = 'border-green-500';
                break;
            case 'error':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                borderColor = 'border-red-500';
                break;
            case 'warning':
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                borderColor = 'border-yellow-500';
                break;
        }

        return (
            <div
                className={`fixed top-20 right-4 p-4 rounded-lg shadow-xl border-l-4 ${bgColor} ${textColor} ${borderColor} z-50 transition-opacity duration-300`}
                role="alert"
            >
                <div className="flex justify-between items-center">
                    <p className="font-medium">{message.text}</p>
                    <button onClick={() => setFeedbackMessage(null)} className="ml-4 text-lg font-bold">
                        &times;
                    </button>
                </div>
            </div>
        );
    };

    // 加入申請確認モーダル
    const ApplyModal: React.FC<{ nation: Nation, onClose: () => void, onConfirm: () => void, feedback: typeof feedbackMessage }> = ({ nation, onClose, onConfirm, feedback }) => (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
                <h3 className="text-xl font-bold mb-3 text-gray-800">加入申請の確認</h3>
                <p className="text-lg mb-4 text-gray-700 font-semibold">
                    <span className="text-blue-600">{nation.name}</span> に加入申請しますか?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mb-5">
                    <p className="text-sm text-gray-600">月額維持費: <span className="font-bold text-lg text-red-600">{nation.maintenance_fee.toLocaleString()}pt</span></p>
                    <p className="text-xs text-gray-500 mt-1">申請後、オーナーの承認が必要です。</p>
                </div>

                {/* モーダル内での警告表示 */}
                {feedback && feedback.type === 'warning' && (
                    <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
                        <p className="text-sm font-medium">{feedback.text}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        onClick={onClose}
                    >
                        キャンセル
                    </button>
                    <button
                        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-md"
                        onClick={onConfirm}
                    >
                        申請する
                    </button>
                </div>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <FeedbackAlert message={feedbackMessage} />

            <div className="flex">
                {/* サイドバー (PC表示) */}
                <div className="hidden lg:block">
                    <Sidebar isMobileMenuOpen={false} />
                </div>

                {/* メインコンテンツ */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2 border-gray-200">
                            🌍 国一覧
                        </h1>

                        {/* モバイルメニューボタン */}
                        <button
                            className="lg:hidden p-3 bg-white rounded-lg shadow mb-4 text-gray-600 hover:bg-gray-100 transition"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? '✕ メニューを閉じる' : '☰ メニューを開く'}
                        </button>

                        {/* 検索・フィルターバー */}
                        <div className="bg-white p-5 rounded-xl shadow-lg mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
                                {/* 検索ボックス */}
                                <div className="lg:col-span-2">
                                    <label htmlFor="search" className="sr-only">国を検索...</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                                        <input
                                            id="search"
                                            type="text"
                                            placeholder="国を検索..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1); // 検索時にページをリセット
                                            }}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* レベルドロップダウン */}
                                <div>
                                    <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-1">レベル▼</label>
                                    <select
                                        id="level-filter"
                                        value={selectedLevel}
                                        onChange={(e) => {
                                            setSelectedLevel(e.target.value as NationLevel | 'all');
                                            setCurrentPage(1); // フィルター時にページをリセット
                                        }}
                                        className="w-full p-2 border border-gray-300 bg-white rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        {levelOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 並び替えドロップダウン */}
                                <div>
                                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">並び替え▼</label>
                                    <select
                                        id="sort-by"
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            setCurrentPage(1); // 並び替え時にページをリセット
                                        }}
                                        className="w-full p-2 border border-gray-300 bg-white rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 新しい国を申請ボタン */}
                            <div className="mt-4">
                                <button
                                    className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                                    onClick={() => console.log('Navigating to /nations/new')}
                                >
                                    + 新しい国を申請
                                </button>
                            </div>
                        </div>

                        {/* 国一覧 */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">【国一覧】</h2>
                                <span className="text-sm font-medium text-gray-500">({totalItems}件)</span>
                            </div>
                            <div className="border-t border-b border-gray-300 mb-6"></div>

                            {totalItems === 0 ? (
                                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                                    <p className="text-lg text-gray-600">該当する国は見つかりませんでした。</p>
                                    <p className="text-sm text-gray-500 mt-2">検索条件を変更するか、新しい国を申請してみてください。</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {currentNations.map(nation => (
                                        <NationCard
                                            key={nation.id}
                                            nation={nation}
                                            onApply={handleApplyClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ページネーション */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* モバイルサイドバーオーバーレイ */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
            <div className="lg:hidden">
                <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
            </div>

            {/* フッターのプレースホルダー */}
            <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
                © 2024 NextNation Project. All rights reserved.
            </footer>

            {/* モーダル表示 */}
            {modalNation && (
                <ApplyModal
                    nation={modalNation}
                    onClose={() => {
                        setModalNation(null);
                        setFeedbackMessage(null); // モーダルを閉じるときに警告もリセット
                    }}
                    onConfirm={handleConfirmApply}
                    feedback={feedbackMessage}
                />
            )}
        </div>
    );
}
