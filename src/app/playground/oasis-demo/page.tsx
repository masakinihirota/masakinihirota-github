
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OasisDemoPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-8 py-12 md:px-16 md:py-16">

                {/* Title */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">オアシス宣言</h1>
                    <p className="text-xl text-gray-500 font-medium">Oasis Declaration</p>
                </div>

                <div className="space-y-16">

                    {/* Preamble */}
                    <section>
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gray-300 w-16"></div>
                            <h2 className="px-4 text-2xl font-bold text-gray-800">前文</h2>
                            <div className="h-px bg-gray-300 w-16"></div>
                        </div>
                        <div className="text-lg text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                            <p>
                                私たちは、多様な価値観を尊重し、互いに理解し合うことを目指すオンラインコミュニティを作ります。
                                作品を通じた文化交流と対話を促進し、個人の成長と社会の発展に貢献することを目的とします。
                            </p>
                        </div>
                    </section>

                    {/* Article 1 */}
                    <section>
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gray-300 w-16"></div>
                            <h2 className="px-4 text-2xl font-bold text-gray-800">第1条 多様性の尊重</h2>
                            <div className="h-px bg-gray-300 w-16"></div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-8">
                            <ul className="space-y-4 text-lg text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-blue-600">1.</span>
                                    異なる価値観を持つ人々を尊重し、排除しない。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-blue-600">2.</span>
                                    文化的背景の違いを認め、偏見を持たない。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-blue-600">3.</span>
                                    多様な意見を歓迎し、対話を通じて理解を深める。
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Article 2 */}
                    <section>
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gray-300 w-16"></div>
                            <h2 className="px-4 text-2xl font-bold text-gray-800">第2条 対話の促進</h2>
                            <div className="h-px bg-gray-300 w-16"></div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-8">
                            <ul className="space-y-4 text-lg text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-green-600">1.</span>
                                    作品を通じた文化交流を積極的に行う。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-green-600">2.</span>
                                    建設的な対話を心がけ、攻撃的な言動を避ける。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-green-600">3.</span>
                                    異なる意見に対しても敬意を払い、理解を試みる。
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Article 3 */}
                    <section>
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gray-300 w-16"></div>
                            <h2 className="px-4 text-2xl font-bold text-gray-800">第3条 誠実な行動</h2>
                            <div className="h-px bg-gray-300 w-16"></div>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-8">
                            <ul className="space-y-4 text-lg text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-yellow-600">1.</span>
                                    正直に自分の価値観や意見を表明する。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-yellow-600">2.</span>
                                    虚偽の情報を広めず、事実に基づいた発言をする。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-yellow-600">3.</span>
                                    他者を欺かず、信頼関係を大切にする。
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Article 4 */}
                    <section>
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gray-300 w-16"></div>
                            <h2 className="px-4 text-2xl font-bold text-gray-800">第4条 成長と学び</h2>
                            <div className="h-px bg-gray-300 w-16"></div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-8">
                            <ul className="space-y-4 text-lg text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-purple-600">1.</span>
                                    新しい作品や価値観に触れ、自己成長を目指す。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-purple-600">2.</span>
                                    他者から学び、自分の視野を広げる。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-purple-600">3.</span>
                                    失敗を恐れず、挑戦し続ける。
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Article 5 */}
                    <section>
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-px bg-gray-300 w-16"></div>
                            <h2 className="px-4 text-2xl font-bold text-gray-800">第5条 コミュニティへの貢献</h2>
                            <div className="h-px bg-gray-300 w-16"></div>
                        </div>
                        <div className="bg-pink-50 rounded-xl p-8">
                            <ul className="space-y-4 text-lg text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-pink-600">1.</span>
                                    作品の紹介や評価を通じて、文化の発展に貢献する。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-pink-600">2.</span>
                                    他のメンバーを支援し、協力する。
                                </li>
                                <li className="flex items-start">
                                    <span className="font-bold mr-3 text-pink-600">3.</span>
                                    コミュニティのルールを守り、健全な環境を維持する。
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="text-center bg-gray-50 rounded-xl p-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">結び</h2>
                        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                            この宣言に賛同し、実践することで、私たちはより豊かで多様性に満ちたコミュニティを築きます。
                            オアシスのように、誰もが安心して集い、交流できる場所を目指します。
                        </p>
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
