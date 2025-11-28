
import { rootAccount, profiles, achievements } from './data';
import { Plus, Settings, History, Trophy, Lock, User, Briefcase, Smile, Shield } from 'lucide-react';
import Link from 'next/link';

export default function RootAccountDemoPage() {
    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

            {/* Main Content Area */}
            <div className="flex-1 space-y-8 order-2 lg:order-1">

                {/* Root Account Info Card (Mobile/Tablet only, or main view) */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:hidden">
                    <RootAccountInfo />
                </div>

                {/* Profiles Section */}
                <section>
                    <div className="flex items-center mb-4">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">ユーザープロフィール一覧</h2>
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <div className="mb-6">
                        <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Plus className="h-4 w-4 mr-2" />
                            新しいプロフィールを作成
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profiles.map((profile) => (
                            <div key={profile.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${profile.name}`} alt={profile.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {profile.purpose === '仕事' ? <Briefcase className="h-3 w-3 mr-1" /> : <Smile className="h-3 w-3 mr-1" />}
                                                {profile.purpose}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.role === 'リーダー' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {profile.role === 'リーダー' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                                {profile.role}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{profile.bio}</p>
                                        <div className="mt-4 flex space-x-3">
                                            <Link href={`/playground/profile-demo/${profile.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                                詳細を見る
                                            </Link>
                                            <span className="text-gray-300">|</span>
                                            <Link href={`/playground/profile-demo/${profile.id}/edit`} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                                編集
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Achievements Section */}
                <section>
                    <div className="flex items-center mb-4">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <h2 className="px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">アチーブメント</h2>
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {achievements.map((achievement) => (
                                <li key={achievement.id} className={`p-4 ${achievement.isLocked ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${achievement.isLocked ? 'bg-gray-200 text-gray-400' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {achievement.isLocked ? <Lock className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-sm font-bold ${achievement.isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                                    {achievement.name}
                                                </h4>
                                                {!achievement.isLocked && (
                                                    <span className="text-xs text-gray-500">
                                                        取得日: {achievement.awardedAt}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
                            <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                すべて見る &rarr;
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar Info (Desktop) */}
            <div className="w-full lg:w-80 space-y-6 order-1 lg:order-2">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24 hidden lg:block">
                    <RootAccountInfo />
                </div>
            </div>

        </div>
    );
}

function RootAccountInfo() {
    return (
        <div className="text-center">
            <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden mx-auto mb-4">
                <img src={`https://ui-avatars.com/api/?name=${rootAccount.displayName}&size=128`} alt={rootAccount.displayName} className="h-full w-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{rootAccount.displayName}</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {rootAccount.id}</p>

            <div className="mt-6 space-y-3 text-left">
                <InfoRow label="居住地" value={rootAccount.location} />
                <InfoRow label="母語" value={rootAccount.nativeLanguage} />
                <InfoRow label="生誕世代" value={rootAccount.birthGeneration} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">ポイント残高</span>
                    <span className="text-lg font-bold text-gray-900">{rootAccount.points.toLocaleString()} pt</span>
                </div>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <History className="h-4 w-4 mr-2 text-gray-400" />
                    ポイント履歴を見る
                </button>
            </div>

            <div className="mt-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <Settings className="h-4 w-4 mr-2 text-gray-400" />
                    設定
                </button>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
        </div>
    );
}
