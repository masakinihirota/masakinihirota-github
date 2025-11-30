
import { contents } from '../data';
import { Search, MoreVertical, FileText, MessageSquare, AlertTriangle } from 'lucide-react';

export default function AdminContentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">コンテンツ管理</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="コンテンツを検索..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                タイトル / 内容
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                投稿者
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                タイプ
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ステータス
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                通報数
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">操作</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contents.map((content) => (
                            <tr key={content.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                                    <div className="text-xs text-gray-500">{content.createdAt}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {content.author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center text-sm text-gray-500">
                                        {content.type === 'work' ? <FileText className="h-4 w-4 mr-1" /> : <MessageSquare className="h-4 w-4 mr-1" />}
                                        {content.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${content.status === 'published' ? 'bg-green-100 text-green-800' :
                                            content.status === 'flagged' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {content.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {content.reports > 0 ? (
                                        <span className="inline-flex items-center text-red-600 font-medium">
                                            <AlertTriangle className="h-4 w-4 mr-1" />
                                            {content.reports}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
