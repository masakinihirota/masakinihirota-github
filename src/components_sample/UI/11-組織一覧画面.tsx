"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, Plus, Users, LayoutDashboard, Settings, LogOut, ArrowLeft, ArrowRight, User } from 'lucide-react';

// ====================================================================
// モックデータと定数
// ====================================================================

// 組織の状態定義
const ORGANIZATION_STATUS = {
    DRAFT: { label: '草案', color: 'bg-gray-100 text-gray-600 border border-gray-300' },
    RECRUITING: { label: '募集中', color: 'bg-yellow-100 text-yellow-700 border border-yellow-300' },
    ACTIVE: { label: '運営中', color: 'bg-green-100 text-green-700 border border-green-300' },
    DISSOLVED: { label: '解散済み', color: 'bg-red-100 text-red-700 border border-red-300' },
};

// 組織リストのモックデータ
const MOCK_ORGANIZATIONS = [
    { id: '1', name: 'ファンタジー愛好会', leader_username: '@user_x', current_members: 12, max_members: 30, lifecycle_stage: 'ACTIVE', created_at: '2024/01/15', description: 'この組織は、ファンタジー作品を愛する仲間が集まるコミュニティです。' },
    { id: '2', name: 'SFクリエイターズラボ', leader_username: '@user_y', current_members: 5, max_members: 20, lifecycle_stage: 'RECRUITING', created_at: '2024/11/01', description: 'SF作品を語り合い、未来のアイデアを創造する組織です。新規メンバーを熱烈歓迎中！' },
    { id: '3', name: '歴史探求グループ', leader_username: '@user_z', current_members: 8, max_members: 10, lifecycle_stage: 'ACTIVE', created_at: '2023/05/20', description: '古代文明から現代史まで、歴史の謎を深く掘り下げます。' },
    { id: '4', name: 'モバイル開発部（ベータ）', leader_username: '@dev_a', current_members: 2, max_members: 15, lifecycle_stage: 'DRAFT', created_at: '2025/01/10', description: '最新のモバイル技術を研究し、プロトタイプを開発するための初期草案組織です。' },
    { id: '5', name: '解散済みテスト組織', leader_username: '@old_b', current_members: 0, max_members: 5, lifecycle_stage: 'DISSOLVED', created_at: '2022/03/01', description: '活動を終了した組織です。' },
    { id: '6', name: 'アート・デザイン集団: 色彩の魔法使い', leader_username: '@art_c', current_members: 15, max_members: 15, lifecycle_stage: 'ACTIVE', created_at: '2024/08/22', description: 'デジタルアート、イラスト、UI/UXデザインなど、幅広いクリエイティブ活動を行います。現在満員です。' },
];

// ダミーデータ水増し (合計45件以上にする)
const TOTAL_ITEMS = 45;
for (let i = MOCK_ORGANIZATIONS.length + 1; i <= TOTAL_ITEMS; i++) {
    MOCK_ORGANIZATIONS.push({
        id: String(i),
        name: `組織${i}`,
        leader_username: `@user_${i}`,
        current_members: i % 10,
        max_members: 20,
        lifecycle_stage: (i % 3 === 0) ? 'RECRUITING' : 'ACTIVE',
        created_at: `2024/${String(i % 12 + 1).padStart(2, '0')}/${String(i % 28 + 1).padStart(2, '0')}`,
        description: `これはジェネレートされたダミー組織${i}の説明文です。`,
    });
}

// ページネーション設定
const ITEMS_PER_PAGE = 20;

// ====================================================================
// UIコンポーネント
// ====================================================================

/**
 * 組織の状態を色付きタグで表示するコンポーネント
 */
const StatusTag = ({ stage }) => {
    const statusInfo = ORGANIZATION_STATUS[stage] || ORGANIZATION_STATUS.DRAFT;
    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
        </span>
    );
};

/**
 * ドロップダウンメニューコンポーネント（汎用）
 */
const Dropdown = ({ label, options, selectedValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    // ドロップダウン外のクリックで閉じる処理
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const displayLabel = options.find(opt => opt.value === selectedValue)?.label || label;

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                {displayLabel}
                <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option) => (
                            <a
                                key={option.value}
                                href="#"
                                className={`block px-4 py-2 text-sm ${selectedValue === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                role="menuitem"
                            >
                                {option.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * 組織カードコンポーネント
 */
const OrganizationCard = ({ organization, onJoinClick, isMember = false }) => {
    const { name, leader_username, current_members, max_members, lifecycle_stage, created_at, description } = organization;
    const status = ORGANIZATION_STATUS[lifecycle_stage];
    const canJoin = !isMember && (lifecycle_stage === 'RECRUITING' || lifecycle_stage === 'ACTIVE');

    // スマホ表示用に説明文を短縮
    const shortDescription = description.length > 70 ? description.substring(0, 70) + '...' : description;

    const handleJoinClick = () => {
        if (canJoin) {
            onJoinClick(organization);
        }
    };

    return (
        <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <StatusTag stage={lifecycle_stage} />
            </div>

            <div className="text-sm text-gray-600 space-y-2 mb-4">
                <p>
                    <User className="inline h-4 w-4 mr-2 text-blue-500" />
                    リーダー: <span className="font-medium text-gray-800">{leader_username}</span>
                </p>
                <p>
                    <Users className="inline h-4 w-4 mr-2 text-blue-500" />
                    メンバー: <span className="font-medium text-gray-800">{current_members}/{max_members}人</span>
                </p>
                <p className="sm:hidden lg:block">
                    開始時期: {created_at}
                </p>
            </div>

            <p className="text-gray-700 text-sm mb-4 flex-grow">
                説明: <span className="sm:hidden md:inline">{description}</span>
                <span className="md:hidden">{shortDescription}</span> {/* スマホで簡略化 */}
            </p>

            <div className="flex space-x-3 mt-4">
                <button
                    onClick={() => console.log(`[詳細を見る] ${name}`)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-150"
                >
                    詳細を見る
                </button>
                {canJoin && (
                    <button
                        onClick={handleJoinClick}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                    >
                        参加申請
                    </button>
                )}
                {isMember && (
                    <button
                        disabled
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed"
                    >
                        参加済み
                    </button>
                )}
                {lifecycle_stage === 'DISSOLVED' && (
                    <button
                        disabled
                        className="flex-1 px-4 py-2 text-sm font-medium text-red-400 bg-red-100 rounded-lg cursor-not-allowed"
                    >
                        解散済み
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * ページネーションコンポーネント
 */
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
    } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
    } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const PageButton = ({ page, isCurrent, children }) => (
        <button
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 mx-1 rounded-md text-sm transition duration-150 ${isCurrent
                ? 'bg-blue-600 text-white font-semibold shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            disabled={isCurrent}
        >
            {children || page}
        </button>
    );

    return (
        <div className="flex justify-center items-center mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                前へ
            </button>

            {pages.map(page => (
                <PageButton key={page} page={page} isCurrent={page === currentPage} />
            ))}

            {totalPages > maxPagesToShow && endPage < totalPages && <span className="px-3">...</span>}
            {totalPages > maxPagesToShow && endPage < totalPages && (
                <PageButton key={totalPages} page={totalPages}>{totalPages}</PageButton>
            )}


            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                次へ
                <ArrowRight className="h-4 w-4 inline ml-1" />
            </button>
        </div>
    );
};

/**
 * 参加申請確認モーダル
 */
const JoinConfirmModal = ({ organization, isOpen, onClose, onConfirm }) => {
    if (!isOpen || !organization) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">参加申請の確認</h3>
                <p className="text-gray-700 mb-6">
                    組織「<span className="font-semibold text-blue-600">{organization.name}</span>」に参加申請しますか? リーダーの承認が必要です。
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        申請する
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * トースト通知コンポーネント (成功/エラーメッセージ)
 */
const Toast = ({ message, type, onClose }) => {
    if (!message) return null;

    const colorClasses = type === 'success'
        ? 'bg-green-500 border-green-700'
        : 'bg-red-500 border-red-700';
    const icon = type === 'success' ? '✅' : '⚠️';

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`flex items-center p-4 text-white rounded-lg shadow-xl ${colorClasses}`}>
                <span className="text-xl mr-3">{icon}</span>
                <p className="font-medium">{message}</p>
                <button onClick={onClose} className="ml-4 text-white opacity-75 hover:opacity-100 transition">
                    &times;
                </button>
            </div>
        </div>
    );
};

// ====================================================================
// メインレイアウトコンポーネント
// ====================================================================

/**
 * ヘッダーコンポーネントのプレースホルダー
 */
const Header = () => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-blue-600">App Logo</h1>
        <div className="text-sm text-gray-600">ユーザー名 / ログアウト</div>
    </header>
);

/**
 * サイドバーコンポーネントのプレースホルダー
 */
const Sidebar = ({ isMobile, isMenuOpen, setIsMenuOpen }) => {
    const navItems = [
        { name: 'HOME', icon: LayoutDashboard, url: '#' },
        { name: '組織', icon: Users, url: '#', active: true },
        { name: '設定', icon: Settings, url: '#' },
    ];

    const MenuContent = () => (
        <nav className="space-y-2 p-4">
            {navItems.map((item) => (
                <a
                    key={item.name}
                    href={item.url}
                    className={`flex items-center p-3 rounded-lg transition-colors ${item.active
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                </a>
            ))}
            <a
                href="#"
                className="flex items-center p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 mt-4 border-t pt-4"
            >
                <LogOut className="h-5 w-5 mr-3" />
                ログアウト
            </a>
        </nav>
    );

    if (isMobile) {
        return (
            <>
                <button
                    className="p-2 md:hidden absolute top-4 left-4 z-20 bg-white rounded-md shadow-md"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}>
                        <div className="bg-white w-64 h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 text-xl font-bold text-blue-600 border-b">ナビゲーション</div>
                            <MenuContent />
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="w-64 bg-white border-r hidden md:block flex-shrink-0">
            <MenuContent />
        </div>
    );
};

/**
 * フッターコンポーネントのプレースホルダー
 */
const Footer = () => (
    <footer className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t mt-auto">
        &copy; 2024 Your App Name. All rights reserved.
    </footer>
);

/**
 * メインアプリケーション（組織一覧画面）
 */
const OrganizationListPage = () => {
    // 状態管理
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOrder, setSortOrder] = useState('NEWEST'); // NEWEST, MEMBER_COUNT, NAME
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [toastMessage, setToastMessage] = useState({ message: '', type: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // スマホ用

    // フィルターオプション
    const statusOptions = [
        { label: 'すべての状態', value: 'ALL' },
        ...Object.keys(ORGANIZATION_STATUS).map(key => ({
            label: ORGANIZATION_STATUS[key].label,
            value: key,
        })),
    ];
    const sortOptions = [
        { label: '新着順', value: 'NEWEST' },
        { label: 'メンバー数順', value: 'MEMBER_COUNT' },
        { label: '組織名順', value: 'NAME' },
    ];

    // フィルタリングとソート処理
    const filteredAndSortedOrganizations = useMemo(() => {
        let result = [...MOCK_ORGANIZATIONS];

        // 1. フィルタリング (状態)
        if (statusFilter !== 'ALL') {
            result = result.filter(org => org.lifecycle_stage === statusFilter);
        }

        // 2. フィルタリング (検索)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter(org =>
                org.name.toLowerCase().includes(lowerCaseSearch) ||
                org.description.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 3. ソート
        result.sort((a, b) => {
            switch (sortOrder) {
                case 'NEWEST':
                    // 新着順 (新しいものが先)
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'MEMBER_COUNT':
                    // メンバー数順 (多いものが先)
                    return b.current_members - a.current_members;
                case 'NAME':
                    // 組織名順 (A-Z)
                    return a.name.localeCompare(b.name, 'ja');
                default:
                    return 0;
            }
        });

        return result;
    }, [searchTerm, statusFilter, sortOrder]);

    // ページネーション適用
    const totalItems = filteredAndSortedOrganizations.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const paginatedOrganizations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredAndSortedOrganizations.slice(startIndex, endIndex);
    }, [filteredAndSortedOrganizations, currentPage]);

    // ページ変更ハンドラ
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // ページ上部へスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [totalPages]);

    // 参加申請処理
    const handleJoinRequest = (org) => {
        setSelectedOrg(org);
        setIsModalOpen(true);
    };

    const handleConfirmJoin = () => {
        // 実際のSupabase処理の代わりにダミー処理
        setIsModalOpen(false);
        setToastMessage({ message: `組織「${selectedOrg.name}」に参加申請を送信しました!`, type: 'success' });
        console.log(`参加申請送信: ${selectedOrg.name}`);
        setSelectedOrg(null);

        // 5秒後にトーストを消す
        setTimeout(() => setToastMessage({ message: '', type: '' }), 5000);
    };

    const handleCancelJoin = () => {
        setIsModalOpen(false);
        setSelectedOrg(null);
    };

    // 組織作成画面への遷移（ダミー）
    const handleCreateNew = () => {
        console.log("組織作成画面へ遷移: /organizations/new");
        // Next.jsのrouter.push('/organizations/new') に相当
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <div className="flex flex-1">
                <Sidebar isMobile={window.innerWidth < 768} isMenuOpen={isSidebarOpen} setIsMenuOpen={setIsSidebarOpen} />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
                        組織一覧
                    </h2>

                    {/* 検索・フィルターバー */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">

                            {/* 検索ボックス */}
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="組織を検索..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); // 検索時に1ページ目に戻す
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            {/* 状態ドロップダウン */}
                            <Dropdown
                                label="状態▼"
                                options={statusOptions}
                                selectedValue={statusFilter}
                                onChange={(value) => {
                                    setStatusFilter(value);
                                    setCurrentPage(1);
                                }}
                            />

                            {/* 並び替えドロップダウン */}
                            <Dropdown
                                label="並び替え▼"
                                options={sortOptions}
                                selectedValue={sortOrder}
                                onChange={(value) => {
                                    setSortOrder(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* 新規組織作成ボタン */}
                        <button
                            onClick={handleCreateNew}
                            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            新しい組織を作成
                        </button>
                    </div>

                    {/* 組織一覧 */}
                    <div className="mb-8">
                        <div className="flex justify-between items-baseline mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                組織一覧
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({totalItems}件)
                                </span>
                            </h3>
                        </div>

                        <div className="grid gap-6">
                            {paginatedOrganizations.length > 0 ? (
                                paginatedOrganizations.map((org) => (
                                    <OrganizationCard
                                        key={org.id}
                                        organization={org}
                                        onJoinClick={handleJoinRequest}
                                        // 例として、IDが1の組織は参加済みとするダミーフラグ
                                        isMember={org.id === '1'}
                                    />
                                ))
                            ) : (
                                <div className="p-10 bg-white rounded-xl text-center text-gray-500 border border-gray-200">
                                    <p>該当する組織は見つかりませんでした。</p>
                                    <p className="mt-2 text-sm">検索条件を変更するか、新しい組織を作成してみてください。</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ページネーション */}
                    {totalItems > ITEMS_PER_PAGE && (
                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </main>
            </div>

            <Footer />

            {/* モーダルとトースト */}
            <JoinConfirmModal
                organization={selectedOrg}
                isOpen={isModalOpen}
                onClose={handleCancelJoin}
                onConfirm={handleConfirmJoin}
            />
            <Toast
                message={toastMessage.message}
                type={toastMessage.type}
                onClose={() => setToastMessage({ message: '', type: '' })}
            />
        </div>
    );
};

export default OrganizationListPage;
