
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function TermsDemoPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-8 py-12 md:px-16 md:py-16">

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">利用規約</h1>
                    <p className="text-lg text-gray-500 font-medium mb-4">Terms of Service</p>
                    <p className="text-sm text-gray-400">最終更新日: 2024年12月31日</p>
                </div>

                <div className="space-y-12">

                    {/* Article 1 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第1条 総則</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. この利用規約（以下「本規約」）は、VNS masakinihirota（以下「当サービス」）が提供するすべてのサービスの利用条件を定めるものです。
                            </p>
                            <p>
                                2. ユーザーは、本規約に同意の上、当サービスを利用するものとします。
                            </p>
                            <p>
                                3. 本規約に同意しない場合、当サービスを利用することはできません。
                            </p>
                        </div>
                    </section>

                    {/* Article 2 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第2条 アカウント</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. ユーザーは、当サービスの利用にあたり、アカウントを作成する必要があります。
                            </p>
                            <p>
                                2. アカウント情報は正確かつ最新の状態に保つ責任があります。
                            </p>
                            <p>
                                3. アカウントの管理は、ユーザーの責任において行われるものとします。
                            </p>
                            <p>
                                4. アカウント情報の不正使用が判明した場合、速やかに当サービスに報告してください。
                            </p>
                        </div>
                    </section>

                    {/* Article 3 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第3条 コンテンツの投稿</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. ユーザーは、自己の責任において、作品情報、レビュー、コメントなどのコンテンツを投稿できます。
                            </p>
                            <p>
                                2. 投稿するコンテンツは、以下の内容を含んではなりません。
                            </p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>違法または有害な内容</li>
                                <li>他者の権利を侵害する内容</li>
                                <li>差別的または攻撃的な内容</li>
                                <li>虚偽の情報</li>
                            </ul>
                            <p>
                                3. 当サービスは、規約に違反するコンテンツを削除または編集する権利を有します。
                            </p>
                        </div>
                    </section>

                    {/* Article 4 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第4条 知的財産権</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. 当サービスに関するすべての知的財産権は、当サービスまたは権利者に帰属します。
                            </p>
                            <p>
                                2. ユーザーが投稿したコンテンツの知的財産権は、ユーザーに帰属しますが、当サービスはサービス提供のために必要な範囲で使用できます。
                            </p>
                            <p>
                                3. ユーザーは、第三者の知的財産権を侵害しないことに同意します。
                            </p>
                        </div>
                    </section>

                    {/* Article 5 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第5条 プライバシー</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. 当サービスは、ユーザーの個人情報をプライバシーポリシーに従って取り扱います。
                            </p>
                            <p>
                                2. 詳細は、プライバシーポリシーをご確認ください。
                            </p>
                            <div className="mt-4">
                                <Link href="#" className="text-blue-600 hover:text-blue-800 underline">
                                    プライバシーポリシーを見る
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Article 6 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第6条 禁止事項</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>ユーザーは、以下の行為を行ってはなりません。</p>
                            <ol className="list-decimal list-inside pl-4 space-y-2">
                                <li>法令または公序良俗に反する行為</li>
                                <li>犯罪行為に関連する行為</li>
                                <li>他者の権利を侵害する行為</li>
                                <li>当サービスの運営を妨げる行為</li>
                                <li>不正アクセスまたはそれに類する行為</li>
                                <li>虚偽の情報を登録する行為</li>
                                <li>スパムまたは迷惑行為</li>
                                <li>その他、当サービスが不適切と判断する行為</li>
                            </ol>
                        </div>
                    </section>

                    {/* Article 7 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第7条 サービスの変更・停止</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. 当サービスは、事前の通知なく、サービスの内容を変更または停止することがあります。
                            </p>
                            <p>
                                2. サービスの変更・停止により生じた損害について、当サービスは一切の責任を負いません。
                            </p>
                        </div>
                    </section>

                    {/* Article 8 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第8条 免責事項</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. 当サービスは、サービスの正確性、完全性、有用性について保証しません。
                            </p>
                            <p>
                                2. 当サービスは、ユーザー間のトラブルについて一切の責任を負いません。
                            </p>
                            <p>
                                3. 当サービスの利用により生じた損害について、当サービスは一切の責任を負いません。
                            </p>
                        </div>
                    </section>

                    {/* Article 9 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第9条 規約の変更</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. 当サービスは、必要に応じて本規約を変更することがあります。
                            </p>
                            <p>
                                2. 変更後の規約は、当サービスのウェブサイトに掲載した時点で効力を生じます。
                            </p>
                            <p>
                                3. 変更後もサービスを利用した場合、変更後の規約に同意したものとみなします。
                            </p>
                        </div>
                    </section>

                    {/* Article 10 */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">第10条 準拠法・管轄裁判所</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                1. 本規約の準拠法は日本法とします。
                            </p>
                            <p>
                                2. 本規約に関する紛争については、当サービスの所在地を管轄する裁判所を専属的合意管轄裁判所とします。
                            </p>
                        </div>
                    </section>

                    {/* Action Button */}
                    <div className="flex justify-center pt-8 pb-8">
                        <Link
                            href="/playground/home-demo"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all transform hover:scale-105"
                        >
                            <CheckCircle className="mr-2 h-6 w-6" />
                            同意して登録へ進む
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
