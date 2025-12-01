"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Sparkles } from "lucide-react";

export function OasisDeclarationPage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "オアシス宣言 - VNS masakinihirota",
          text: "価値観でつながる安心の場所",
          url: window.location.href,
        });
      } catch {
        // ユーザーがシェアをキャンセルした場合
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* ヒーローエリア */}
      <div className="relative bg-gradient-to-b from-blue-100 to-white dark:from-blue-950 dark:to-background py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Sparkles className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            オアシス宣言
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            価値観でつながる、安心できる場所
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* 宣言文 */}
          <Card className="border-none shadow-lg">
            <CardContent className="py-12 px-8 md:px-16">
              <div className="space-y-8 text-center">
                <p className="text-lg leading-loose text-muted-foreground">
                  私たちは、
                </p>
                <p className="text-2xl md:text-3xl font-bold leading-relaxed">
                  すべての人が<br />
                  自分らしくいられる場所を<br />
                  創ることを宣言します。
                </p>
                <div className="py-4">
                  <div className="w-16 h-0.5 bg-primary mx-auto" />
                </div>
                <p className="text-lg leading-loose text-muted-foreground">
                  価値観は人それぞれ。<br />
                  多様性を認め、尊重し合うことで、<br />
                  誰もが心安らげる<br />
                  オアシスのような空間が生まれます。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3つの約束 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">私たちの3つの約束</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="py-8 text-center space-y-3">
                  <div className="text-4xl">🤝</div>
                  <h3 className="font-bold text-lg">尊重</h3>
                  <p className="text-sm text-muted-foreground">
                    異なる価値観を持つ人々を<br />
                    互いに尊重します
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8 text-center space-y-3">
                  <div className="text-4xl">🛡️</div>
                  <h3 className="font-bold text-lg">安全</h3>
                  <p className="text-sm text-muted-foreground">
                    ハラスメントや<br />
                    誹謗中傷のない場を守ります
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8 text-center space-y-3">
                  <div className="text-4xl">🌱</div>
                  <h3 className="font-bold text-lg">成長</h3>
                  <p className="text-sm text-muted-foreground">
                    共に学び、<br />
                    成長できる環境を作ります
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 背景説明 */}
          <Card className="bg-muted/30">
            <CardContent className="py-8 px-8">
              <h3 className="font-bold text-lg mb-4">オアシスとは</h3>
              <p className="text-muted-foreground leading-relaxed">
                砂漠の中のオアシスのように、VNS masakinihirota は
                デジタル空間における「心の拠り所」です。
                日々の喧騒から離れ、同じ価値観を持つ仲間と出会い、
                創造性を発揮できる場所。
                私たちは、そんな空間を大切に育てていきます。
              </p>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              同意して参加する
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              シェアする
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
