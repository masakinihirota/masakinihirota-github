"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";

export function HumanDeclarationPage() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "人間宣言 - VNS masakinihirota",
          text: "AIと共に、人間らしく生きる",
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
      <div className="relative bg-gradient-to-b from-rose-100 to-white dark:from-rose-950 dark:to-background py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            人間宣言
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AIと共に、人間らしく生きる
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
                  私たちは宣言します。
                </p>
                <p className="text-2xl md:text-3xl font-bold leading-relaxed">
                  AIの時代においても<br />
                  人間の尊厳と創造性を<br />
                  大切にすることを。
                </p>
                <div className="py-4">
                  <div className="w-16 h-0.5 bg-primary mx-auto" />
                </div>
                <p className="text-lg leading-loose text-muted-foreground">
                  テクノロジーは道具であり、<br />
                  人間が主役です。<br />
                  AIと協力しながらも、<br />
                  私たちは人間としての<br />
                  温かさを忘れません。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 私たちの信念 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">私たちの信念</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="py-8 px-6 space-y-3">
                  <div className="text-3xl">👤</div>
                  <h3 className="font-bold text-lg">人間中心の設計</h3>
                  <p className="text-sm text-muted-foreground">
                    すべての機能は人間の幸福と成長のために設計されています。
                    効率だけでなく、人間らしい体験を大切にします。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8 px-6 space-y-3">
                  <div className="text-3xl">🤖</div>
                  <h3 className="font-bold text-lg">AIとの共存</h3>
                  <p className="text-sm text-muted-foreground">
                    AIは私たちのパートナーです。
                    人間の創造性を補い、可能性を広げるために活用します。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8 px-6 space-y-3">
                  <div className="text-3xl">🎨</div>
                  <h3 className="font-bold text-lg">創造性の尊重</h3>
                  <p className="text-sm text-muted-foreground">
                    人間固有の創造性、感性、直感を大切にします。
                    AIには真似できない人間らしさを育てます。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8 px-6 space-y-3">
                  <div className="text-3xl">🌍</div>
                  <h3 className="font-bold text-lg">多様性の包摂</h3>
                  <p className="text-sm text-muted-foreground">
                    あらゆる背景、文化、価値観を持つ人々を歓迎します。
                    違いを認め、共に学び合います。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 権利と責任 */}
          <Card className="bg-muted/30">
            <CardContent className="py-8 px-8">
              <h3 className="font-bold text-lg mb-6">私たちの権利と責任</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-3 text-primary">権利</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 自分の価値観を表明する権利</li>
                    <li>• プライバシーを守られる権利</li>
                    <li>• 安全に活動できる権利</li>
                    <li>• 自由に創作・表現する権利</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-primary">責任</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 他者を尊重する責任</li>
                    <li>• 誠実にコミュニケーションする責任</li>
                    <li>• コミュニティの安全を守る責任</li>
                    <li>• 建設的な関係を築く責任</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 未来へのメッセージ */}
          <div className="text-center space-y-4 py-8">
            <p className="text-lg text-muted-foreground">
              テクノロジーの進化とともに、<br />
              人間の可能性も無限に広がります。
            </p>
            <p className="text-xl font-medium">
              私たちは、人間らしさを忘れずに、<br />
              未来を創造していきます。
            </p>
          </div>

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
