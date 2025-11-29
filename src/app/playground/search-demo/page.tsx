
'use client';

import { useState } from 'react';
import { searchResults, categories } from './data';
import { Search, BookOpen, User, Heart, Zap, List, Link as LinkIcon, Info } from 'lucide-react';
import Link from 'next/link';

export default function SearchDemoPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter logic
    const filteredResults = searchResults.filter((result) => {
        const matchesSearch =
            result.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || result.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'work': return <BookOpen className="h-6 w-6 text-blue-500" />;
            case 'user': return <User className="h-6 w-6 text-green-500" />;
            case 'value': return <Heart className="h-6 w-6 text-red-500" />;
            case 'skill': return <Zap className="h-6 w-6 text-yellow-500" />;
            case 'list': return <List className="h-6 w-6 text-purple-500" />;
            case 'chain': return <LinkIcon className="h-6 w-6 text-indigo-500" />;
            default: return <Info className="h-6 w-6 text-gray-500" />;
        }
    };

    const getLabel = (type: string) => {
        const category = categories.find(c => c.id === type);
        return category ? category.label : type;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg shadow-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="キーワードを入力..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${selectedCategory === category.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-lg font-bold text-gray-900">検索結果 <span className="text-gray-500 font-normal text-base ml-2">({filteredResults.length}件)</span></h2>
                </div>

                <div className="space-y-4">
                    {filteredResults.map((result) => (
                        <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 pt-1">
                                    {getIcon(result.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">
                                            {result.title || result.name}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {getLabel(result.type)}
                                        </span>
                                    </div>

                                    {result.category && (
                                        <p className="text-sm text-gray-500 mb-1">カテゴリ: {result.category}</p>
                                    )}
                                    {result.author && (
                                        <p className="text-sm text-gray-500 mb-1">著者: {result.author}</p>
                                    )}
                                    {result.profile && (
                                        <p className="text-sm text-gray-500 mb-1">{result.profile}</p>
                                    )}
                                    {result.skills && (
                                        <p className="text-sm text-gray-500 mb-1">スキル: {result.skills.join(', ')}</p>
                                    )}

                                    <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                                        {result.description}
                                    </p>

                                    <div className="mt-4">
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                            詳細を見る &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredResults.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                            <Search className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">検索結果が見つかりません</h3>
                            <p className="mt-1 text-sm text-gray-500">別のキーワードでお試しください。</p>
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
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredResults.length}</span> of <span className="font-medium">{filteredResults.length}</span> results
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
