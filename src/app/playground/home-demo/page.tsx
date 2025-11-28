
import { currentUser, recentActivities, recommendedUsers, recommendedWorks } from './data';
import { UserPlus, BookOpen, Users, ArrowRight, Heart, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomeDemoPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    ようこそ、{currentUser.displayName}さん
                </h1>
                <p className="mt-2 text-gray-600">
                    VNS masakinihirota で価値観を共有しましょう！
                </p>
            </div>

            {/* Quick Actions */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">クイックアクション</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionButton
                        icon={Users}
                        label="マッチング開始"
                        href="/playground/home-demo/matching"
                        color="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    />
                    <QuickActionButton
                        icon={BookOpen}
                        label="作品登録"
                        href="/playground/home-demo/works/new"
                        color="bg-green-50 text-green-700 hover:bg-green-100"
                    />
                    <QuickActionButton
                        icon={UserPlus}
                        label="プロフィール作成"
                        href="/playground/home-demo/profile/edit"
                        color="bg-purple-50 text-purple-700 hover:bg-purple-100"
                    />
                </div>
            </section>

            {/* Recent Activity */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">最近の活動</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {recentActivities.map((activity) => (
                            <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(activity.timestamp).toLocaleString('ja-JP', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="ml-2">
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
                        <Link href="/playground/home-demo/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            すべて見る &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recommendations */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">おすすめ</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div className="space-y-6">
                    {/* Recommended Users */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">似た価値観のユーザー</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedUsers.map((user) => (
                                <div key={user.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{user.name}</h4>
                                            <div className="flex items-center mt-1">
                                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    一致度: {user.matchRate}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Works */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">あなたにおすすめの作品</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedWorks.map((work) => (
                                <div key={work.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="h-32 bg-gray-200 relative">
                                        {/* Placeholder for thumbnail */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                            <BookOpen className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-medium text-blue-600 mb-1 block">{work.category}</span>
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{work.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function QuickActionButton({ icon: Icon, label, href, color }: { icon: any, label: string, href: string, color: string }) {
    return (
        <Link href={href} className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all shadow-sm hover:shadow-md ${color}`}>
            <Icon className="h-8 w-8 mb-3" />
            <span className="font-bold text-sm">{label}</span>
        </Link>
    );
}

function ActivityIcon({ type }: { type: string }) {
    switch (type) {
        case 'matching':
            return <div className="p-2 rounded-full bg-blue-100 text-blue-600"><Users className="h-4 w-4" /></div>;
        case 'follow':
            return <div className="p-2 rounded-full bg-green-100 text-green-600"><UserPlus className="h-4 w-4" /></div>;
        case 'clap':
            return <div className="p-2 rounded-full bg-yellow-100 text-yellow-600"><Star className="h-4 w-4" /></div>;
        case 'invite':
            return <div className="p-2 rounded-full bg-purple-100 text-purple-600"><Heart className="h-4 w-4" /></div>;
        default:
            return <div className="p-2 rounded-full bg-gray-100 text-gray-600"><ArrowRight className="h-4 w-4" /></div>;
    }
}
