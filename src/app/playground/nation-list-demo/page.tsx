
'use client';

import { useState } from 'react';
import { nations, levels, sortOptions } from './data';
import { Search, Plus, Filter, ArrowUpDown, Users, Coins, Info, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function NationListDemoPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedSort, setSelectedSort] = useState('newest');

    // Filter and sort logic
    const filteredNations = nations
        .filter((nation) => {
            const matchesSearch = nation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                nation.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevel === 'all' || nation.level === selectedLevel;
            return matchesSearch && matchesLevel;
        })
        .sort((a, b) => {
            if (selectedSort === 'population') {
                return b.population - a.population;
            } else if (selectedSort === 'level') {
                // Mock level sort (Metropolis > City > Town > Village)
                const levelOrder = { 'Metropolis': 4, 'City': 3, 'Town': 2, 'Village': 1 };
                return (levelOrder[b.level as keyof typeof levelOrder] || 0) - (levelOrder[a.level as keyof typeof levelOrder] || 0);
            } else if (selectedSort === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                // newest (mock implementation based on since string)
                return b.since.localeCompare(a.since);
            }
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'preparing': return 'bg-gray-100 text-gray-800';
            case 'reviving': return 'bg-blue-100 text-blue-800';
            case 'extinct': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'Metropolis': return '🏙️';
            case 'City': return '🏙️';
            case 'Town': return '🏘️';
            case 'Village': return '🏡';
            default: return '🏳️';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Metropolis': return 'text-red-600 bg-red-50 border-red-200';
            case 'City': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Town': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Village': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-1 w-full gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="国を検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                        >
                            {levels.map((level) => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <Link
                    href="#"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full md:w-auto justify-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    新しい国を申請
                </Link>
            </div>

            {/* Nation List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-lg font-bold text-gray-900">国一覧 <span className="text-gray-500 font-normal text-base ml-2">({filteredNations.length}件)</span></h2>
                </div>

                <div className="space-y-4">
                    {filteredNations.map((nation) => (
                        <div key={nation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{nation.name}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(nation.level)}`}>
                                            {getLevelIcon(nation.level)} {nation.levelLabel}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nation.status)}`}>
                                            {nation.statusLabel}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                                            人口: <span className="text-gray-700 ml-1">{nation.population}人</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Coins className="h-4 w-4 mr-1.5 text-gray-400" />
                                            維持費: <span className="text-gray-700 ml-1">{nation.maintenanceFee}pt/月</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
                                            開始: <span className="text-gray-700 ml-1">{nation.since}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {nation.description}
                                    </p>
                                </div>

                                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                    <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        詳細を見る
                                    </button>
                                    {nation.status === 'active' && (
                                        <button
                                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            onClick={() => alert(`${nation.name}に加入申請しますか？\n月額維持費: ${nation.maintenanceFee}pt`)}
                                        >
                                            加入申請
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredNations.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                            <Info className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">国が見つかりません</h3>
                            <p className="mt-1 text-sm text-gray-500">検索条件を変更して再度お試しください。</p>
                        </div>
                    )}
                </div>

                {/* Pagination (Mock) */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                        <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredNations.length}</span> of <span className="font-medium">{filteredNations.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">1</a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">3</a>
                                <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
