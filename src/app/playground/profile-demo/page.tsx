
import { profile, works, values, skills, organizations } from './data';
import { Edit, UserPlus, Briefcase, Smile, Shield, MapPin, Link as LinkIcon, Star, Heart, Zap, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfileDemoPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Profile Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="px-6 pb-6">
                    <div className="relative flex items-end -mt-12 mb-4">
                        <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${profile.name}&size=128`} alt={profile.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4 mb-1 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {profile.purpose === '仕事' ? <Briefcase className="h-3 w-3 mr-1" /> : <Smile className="h-3 w-3 mr-1" />}
                                    {profile.purpose}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.role === 'リーダー' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {profile.role === 'リーダー' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                    {profile.role}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {profile.type}
                                </span>
                            </div>
                        </div>
                        <div className="mb-1">
                            {profile.isOwnProfile ? (
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                    <Edit className="h-4 w-4 mr-2" />
                                    プロフィール編集
                                </button>
                            ) : (
                                <button className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${profile.isFollowing ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none`}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    {profile.isFollowing ? 'フォロー中' : 'フォローする'}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 mb-4 max-w-3xl">{profile.bio}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            東京, 日本
                        </div>
                        <div className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-1 text-gray-400" />
                            <a href="#" className="text-blue-600 hover:underline">portfolio.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Works & Values */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Works Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                登録作品
                            </h2>
                            <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">すべて見る</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {works.map((work) => (
                                <div key={work.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-32 bg-gray-200 relative">
                                        {/* Placeholder for thumbnail */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${work.status === '今' ? 'bg-green-100 text-green-800' :
                                                    work.status === '未来' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {work.status}
                                            </span>
                                            <span className="text-xs text-gray-500">Tier {work.tier}</span>
                                        </div>
                                        <h3 className="text-md font-bold text-gray-900 mb-1">{work.title}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="mr-1">👏</span> {work.claps}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Values Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Heart className="h-5 w-5 mr-2 text-pink-500" />
                                価値観
                            </h2>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {values.map((val) => (
                                <div key={val.id} className="p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">{val.question}</h3>
                                    <p className="text-gray-900">{val.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Column: Skills & Organizations */}
                <div className="space-y-8">

                    {/* Skills Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                                スキル
                            </h2>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4">
                            {skills.map((skill) => (
                                <div key={skill.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-900">{skill.name}</span>
                                        <span className="text-gray-500">Lv.{skill.level}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Organizations Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-gray-500" />
                                所属組織
                            </h2>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {organizations.map((org) => (
                                <div key={org.id} className="p-4 flex items-center">
                                    <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3"></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{org.name}</h3>
                                        <p className="text-xs text-gray-500">{org.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
}
