
import { works, categories } from './data';
import { Search, Filter, Plus, Heart } from 'lucide-react';
import Link from 'next/link';

export default function WorksDemoPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">作品一覧</h1>
                <Link href="/playground/work-registration-demo" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    作品を登録
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="作品名、作者名で検索..."
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <div className="relative inline-block text-left">
                        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            {categories.map((cat) => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative inline-block text-left">
                        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>新着順</option>
                            <option>人気順</option>
                            <option>古い順</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Works Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {works.map((work) => (
                    <Link key={work.id} href={`/playground/work-detail-demo/${work.id}`} className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                            {/* Placeholder for thumbnail */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <span className="text-sm">No Image</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                    {work.category}
                                </span>
                                <span className="text-xs text-gray-500">{work.year}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{work.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{work.author}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Heart className="h-4 w-4 mr-1 text-pink-500 fill-current" />
                                <span>{work.claps}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                <div className="flex flex-1 justify-between sm:hidden">
                    <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                    <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">20</span> results
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
    );
}
