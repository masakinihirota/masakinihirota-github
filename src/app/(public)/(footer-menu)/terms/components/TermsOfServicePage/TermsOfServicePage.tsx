"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowUp } from "lucide-react";

// 利用規約の章構成
const tocItems = [
  { id: "intro", title: "はじめに" },
  { id: "definitions", title: "定義" },
  { id: "account", title: "アカウント" },
  { id: "service", title: "サービスの利用" },
  { id: "content", title: "コンテンツ" },
  { id: "prohibited", title: "禁止事項" },
  { id: "liability", title: "免責事項" },
  { id: "changes", title: "規約の変更" },
  { id: "contact", title: "お問い合わせ" },
];

export function TermsOfServicePage() {
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
          <div className="sticky top-6">
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
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-3xl">
          <div className="space-y-6">
            {/* ヘッダー */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">利用規約</h1>
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

            {/* 規約本文 */}
            <div className="prose prose-sm max-w-none space-y-8">
              <section id="intro">
                <h2 className="text-xl font-semibold mb-4">第1条（はじめに）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  この利用規約（以下「本規約」）は、VNS masakinihirota（以下「本サービス」）の利用条件を定めるものです。
                  ユーザーの皆様は、本規約に同意の上、本サービスをご利用ください。
                </p>
              </section>

              <section id="definitions">
                <h2 className="text-xl font-semibold mb-4">第2条（定義）</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>「ユーザー」とは、本サービスを利用するすべての方を指します。</li>
                  <li>「コンテンツ」とは、テキスト、画像、動画等のユーザーが投稿したすべての情報を指します。</li>
                  <li>「国（ネイション）」とは、本サービス内で形成されるコミュニティを指します。</li>
                  <li>「組織」とは、国内で活動するグループを指します。</li>
                </ul>
              </section>

              <section id="account">
                <h2 className="text-xl font-semibold mb-4">第3条（アカウント）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ユーザーは、本サービスを利用するにあたり、正確な情報を提供する必要があります。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>アカウント情報の管理責任はユーザー自身にあります。</li>
                  <li>アカウントの譲渡・貸与は禁止されています。</li>
                  <li>不正アクセスを発見した場合は、速やかに報告してください。</li>
                </ul>
              </section>

              <section id="service">
                <h2 className="text-xl font-semibold mb-4">第4条（サービスの利用）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ユーザーは、本サービスを善良な管理者の注意をもって利用するものとします。
                  サービスの利用は個人の責任において行われ、その結果についても自己責任となります。
                </p>
              </section>

              <section id="content">
                <h2 className="text-xl font-semibold mb-4">第5条（コンテンツ）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ユーザーが投稿するコンテンツの著作権は、投稿したユーザーに帰属します。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>他者の権利を侵害するコンテンツの投稿は禁止されています。</li>
                  <li>本サービスは、コンテンツの表示・配信に必要な範囲で利用権を有します。</li>
                </ul>
              </section>

              <section id="prohibited">
                <h2 className="text-xl font-semibold mb-4">第6条（禁止事項）</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  以下の行為を禁止します。
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>他のユーザーへの誹謗中傷、嫌がらせ</li>
                  <li>虚偽の情報の提供</li>
                  <li>サービスの運営を妨害する行為</li>
                  <li>不正アクセスやハッキング</li>
                  <li>スパム行為</li>
                </ul>
              </section>

              <section id="liability">
                <h2 className="text-xl font-semibold mb-4">第7条（免責事項）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本サービスは、サービスの完全性、正確性、有用性等について保証するものではありません。
                  ユーザー間のトラブルについて、本サービスは責任を負いません。
                </p>
              </section>

              <section id="changes">
                <h2 className="text-xl font-semibold mb-4">第8条（規約の変更）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本規約は、必要に応じて変更される場合があります。
                  重要な変更がある場合は、サービス内での通知またはメールにてお知らせします。
                </p>
              </section>

              <section id="contact">
                <h2 className="text-xl font-semibold mb-4">第9条（お問い合わせ）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本規約に関するお問い合わせは、お問い合わせフォームよりご連絡ください。
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
