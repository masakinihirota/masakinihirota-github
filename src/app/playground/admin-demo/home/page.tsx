
import { stats } from '../data';
import { Users, FileText, AlertTriangle, Activity } from 'lucide-react';

export default function AdminHomePage() {
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">総ユーザー数</h3>
                        <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        +{stats.newUsersToday} 今日
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">アクティブユーザー</h3>
                        <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {(stats.activeUsers / stats.totalUsers * 100).toFixed(1)}% の利用率
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">総作品数</h3>
                        <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalWorks.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">未対応の通報</h3>
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
                    <p className="text-xs text-red-600 mt-1 font-medium">要対応</p>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">システム稼働状況</h3>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                    [ここにグラフやチャートが表示されます]
                </div>
            </div>
        </div>
    );
}
