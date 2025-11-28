
import { getWorkById, relatedWorks } from '../data';
import { ArrowLeft, Edit, Trash2, Link as LinkIcon, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function WorkDetailDemoPage({ params }: { params?: Promise<{ id: string }> }) {
    // Next's generated PageProps may represent params as a Promise — make this
    // function async and await params to satisfy the generated type checks.
    const resolvedParams = await params;
    const workId = resolvedParams?.id || 'work-1';
    const work = getWorkById(workId);

    if (!work) {
        return <div>Work not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Navigation */}
            <div>
                <Link href="/playground/works-demo" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    一覧へ戻る
                </Link>
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 bg-gray-200 relative min-h-[300px]">
                        {/* Placeholder for thumbnail */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-lg">No Image</span>
                        </div>
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{work.title}</h1>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><span className="font-medium">著者:</span> {work.authors.join(', ')}</p>
                                        <p><span className="font-medium">カテゴリ:</span> {work.category}</p>
                                        <p><span className="font-medium">ジャンル:</span> {work.genres.join(', ')}</p>
                                        <p><span className="font-medium">発売年:</span> {work.year}年</p>
                                        <p><span className="font-medium">サイズ:</span> {work.size}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                👏 拍手する ({work.claps})
                            </button>

                            {work.isOwner && (
                                <div className="flex space-x-3">
                                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                        <Edit className="h-4 w-4 mr-2" />
                                        編集
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        削除
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">作品説明</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {work.description}
                    </p>
                </div>
            </section>

            {/* Related Links */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">関連リンク</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-3">
                    {work.introUrl && (
                        <div className="flex items-center">
                            <LinkIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-500 w-24">紹介URL:</span>
                            <a href={work.introUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate flex-1">
                                {work.introUrl}
                            </a>
                        </div>
                    )}
                    {work.affiliateUrl && (
                        <div className="flex items-center">
                            <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-500 w-24">購入URL:</span>
                            <a href={work.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate flex-1">
                                {work.affiliateUrl}
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Works Chain */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">関連作品チェーン</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div className="relative">
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {relatedWorks.map((related, index) => (
                            <div key={related.id} className="flex items-center">
                                <Link href={`/playground/work-detail-demo/${related.id}`} className="block w-48 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-32 bg-gray-200 relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{related.title}</h3>
                                        <p className="text-xs text-gray-500 truncate">{related.author}</p>
                                    </div>
                                </Link>
                                {index < relatedWorks.length - 1 && (
                                    <div className="mx-2 text-gray-400">
                                        <ArrowRight className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
