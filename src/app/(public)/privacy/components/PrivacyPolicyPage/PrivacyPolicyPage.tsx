"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowUp, Mail } from "lucide-react";

// プライバシーポリシーの章構成
const tocItems = [
  { id: "collection", title: "収集する情報" },
  { id: "usage", title: "情報の利用目的" },
  { id: "sharing", title: "第三者への提供" },
  { id: "security", title: "情報の保護" },
  { id: "rights", title: "ユーザーの権利" },
  { id: "cookies", title: "Cookieの使用" },
  { id: "changes", title: "ポリシーの変更" },
  { id: "contact", title: "お問い合わせ" },
];

export function PrivacyPolicyPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-8">
        {/* サイドバー - 目次 */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">目次</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary py-1"
                  >
                    {item.title}
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* お問い合わせカード */}
            <Card className="bg-muted/50">
              <CardContent className="py-4 text-center space-y-2">
                <Mail className="h-6 w-6 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  個人情報に関するお問い合わせ
                </p>
                <Button variant="outline" size="sm">
                  お問い合わせ
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-3xl">
          <div className="space-y-6">
            {/* ヘッダー */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">プライバシーポリシー</h1>
                <p className="text-muted-foreground mt-2">
                  最終更新日: 2025年1月1日
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="print:hidden"
              >
                <Printer className="h-4 w-4 mr-2" />
                印刷
              </Button>
            </div>

            {/* ポリシー本文 */}
            <div className="prose prose-sm max-w-none space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                VNS masakinihirota（以下「本サービス」）は、ユーザーのプライバシーを尊重し、
                個人情報の保護に努めています。本ポリシーでは、収集する情報とその利用方法について説明します。
              </p>

              <section id="collection">
                <h2 className="text-xl font-semibold mb-4">1. 収集する情報</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  本サービスでは、以下の情報を収集します。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>アカウント情報（メールアドレス、表示名）</li>
                  <li>プロフィール情報（価値観、スキル、自己紹介）</li>
                  <li>投稿コンテンツ（作品、コメント）</li>
                  <li>利用履歴（アクセスログ、操作履歴）</li>
                  <li>デバイス情報（ブラウザ、OS、IPアドレス）</li>
                </ul>
              </section>

              <section id="usage">
                <h2 className="text-xl font-semibold mb-4">2. 情報の利用目的</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  収集した情報は、以下の目的で利用します。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>サービスの提供・運営</li>
                  <li>ユーザー認証・セキュリティの確保</li>
                  <li>マッチング機能の提供</li>
                  <li>サービスの改善・新機能の開発</li>
                  <li>お問い合わせへの対応</li>
                  <li>利用規約違反への対応</li>
                </ul>
              </section>

              <section id="sharing">
                <h2 className="text-xl font-semibold mb-4">3. 第三者への提供</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  以下の場合を除き、個人情報を第三者に提供することはありません。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>ユーザーの同意がある場合</li>
                  <li>法令に基づく開示請求がある場合</li>
                  <li>生命・財産の保護のために必要な場合</li>
                  <li>業務委託先への提供（機密保持契約締結）</li>
                </ul>
              </section>

              <section id="security">
                <h2 className="text-xl font-semibold mb-4">4. 情報の保護</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本サービスは、個人情報の漏洩、滅失、毀損を防止するため、
                  適切なセキュリティ対策を講じています。
                  SSL/TLS暗号化、アクセス制限、定期的なセキュリティ監査を実施しています。
                </p>
              </section>

              <section id="rights">
                <h2 className="text-xl font-semibold mb-4">5. ユーザーの権利</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ユーザーは、自身の個人情報について以下の権利を有します。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>開示請求権（保有する情報の確認）</li>
                  <li>訂正請求権（誤った情報の訂正）</li>
                  <li>削除請求権（データの削除）</li>
                  <li>データポータビリティ権（データのエクスポート）</li>
                </ul>
              </section>

              <section id="cookies">
                <h2 className="text-xl font-semibold mb-4">6. Cookieの使用</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本サービスは、ユーザー体験の向上のためにCookieを使用しています。
                  Cookieはブラウザの設定で無効にすることができますが、
                  一部の機能が利用できなくなる場合があります。
                </p>
              </section>

              <section id="changes">
                <h2 className="text-xl font-semibold mb-4">7. ポリシーの変更</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本ポリシーは、必要に応じて変更される場合があります。
                  重要な変更がある場合は、サービス内での通知またはメールにてお知らせします。
                </p>
              </section>

              <section id="contact">
                <h2 className="text-xl font-semibold mb-4">8. お問い合わせ</h2>
                <p className="text-muted-foreground leading-relaxed">
                  個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。
                </p>
              </section>
            </div>

            {/* トップに戻る */}
            <div className="flex justify-center pt-8 print:hidden">
              <Button variant="outline" onClick={scrollToTop}>
                <ArrowUp className="h-4 w-4 mr-2" />
                トップに戻る
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
