
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PrivacyDemoPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-8 py-12 md:px-16 md:py-16">

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
                    <p className="text-lg text-gray-500 font-medium mb-4">Privacy Policy</p>
                    <p className="text-sm text-gray-400">最終更新日: 2025-11-30</p>
                </div>

                <div className="space-y-12">

                    {/* Introduction */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">1. はじめに</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                VNS masakinihirota（以下「当サービス」）は、ユーザーの個人情報の保護を重要視しています。
                                本プライバシーポリシーは、当サービスが収集する情報、その使用方法、および保護方法について説明するものです。
                            </p>
                        </div>
                    </section>

                    {/* Information Collection */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">2. 収集する情報</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>当サービスは、以下の情報を収集することがあります。</p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>アカウント情報（氏名、メールアドレス、パスワードなど）</li>
                                <li>プロフィール情報（自己紹介、興味・関心、スキルなど）</li>
                                <li>利用状況データ（アクセスログ、クッキーなど）</li>
                                <li>お問い合わせ内容</li>
                            </ul>
                        </div>
                    </section>

                    {/* Use of Information */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">3. 情報の利用目的</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>収集した情報は、以下の目的で利用されます。</p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>サービスの提供および運営</li>
                                <li>ユーザーサポートおよびお問い合わせ対応</li>
                                <li>サービスの改善および新機能の開発</li>
                                <li>利用規約違反の防止および対応</li>
                                <li>重要なお知らせの通知</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sharing of Information */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">4. 情報の第三者提供</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                当サービスは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
                                ただし、サービス運営のために信頼できる委託先に業務を委託する場合があります。
                            </p>
                        </div>
                    </section>

                    {/* Security */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">5. セキュリティ</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                当サービスは、個人情報の漏洩、滅失、毀損を防ぐために適切なセキュリティ対策を講じています。
                                通信の暗号化（SSL/TLS）やアクセス制御などを実施し、情報の安全性を確保します。
                            </p>
                        </div>
                    </section>

                    {/* User Rights */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">6. ユーザーの権利</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                ユーザーは、自身の個人情報の開示、訂正、削除を求める権利を有します。
                                これらの請求については、お問い合わせ窓口までご連絡ください。
                            </p>
                        </div>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">7. ポリシーの変更</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4">
                            <p>
                                当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                                変更後のポリシーは、当サービスのウェブサイトに掲載した時点で効力を生じます。
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px bg-gray-300 w-12"></div>
                            <h2 className="px-4 text-xl font-bold text-gray-800">8. お問い合わせ</h2>
                            <div className="h-px bg-gray-300 w-12"></div>
                        </div>
                        <div className="text-gray-700 leading-relaxed space-y-4 text-center">
                            <p>
                                本プライバシーポリシーに関するお問い合わせは、以下の窓口までお願いいたします。
                            </p>
                            <p className="font-medium">
                                VNS masakinihirota 運営事務局<br />
                                support@example.com
                            </p>
                        </div>
                    </section>

                    {/* Action Button */}
                    <div className="flex justify-center pt-8 pb-8 print:hidden">
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
