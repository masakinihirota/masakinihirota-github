import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Star, Zap, Crown, Gift } from "lucide-react"

/**
 * プライシングページ - プラン比較
 */

const plans = [
  {
    id: "free",
    name: "フリープラン",
    price: 0,
    description: "基本機能を無料でお使いいただけます",
    icon: Gift,
    features: [
      "プロフィール作成",
      "AIマッチング（月10回まで）",
      "基本検索",
      "組織への参加（3つまで）",
      "作品投稿（5つまで）",
    ],
    cta: "現在のプラン",
    current: true,
  },
  {
    id: "standard",
    name: "スタンダードプラン",
    price: 980,
    description: "より多くの機能を利用できます",
    icon: Star,
    features: [
      "フリープランの全機能",
      "AIマッチング（無制限）",
      "詳細検索フィルター",
      "組織への参加（無制限）",
      "作品投稿（50つまで）",
      "プロフィール分析レポート",
      "優先サポート",
    ],
    cta: "アップグレード",
    current: false,
    popular: true,
  },
  {
    id: "pro",
    name: "プロプラン",
    price: 2980,
    description: "すべての機能をフル活用",
    icon: Crown,
    features: [
      "スタンダードプランの全機能",
      "API アクセス",
      "カスタムマッチングルール",
      "組織管理者機能",
      "作品投稿（無制限）",
      "詳細分析ダッシュボード",
      "専任サポート担当",
      "早期アクセス機能",
    ],
    cta: "アップグレード",
    current: false,
  },
]

const pointPackages = [
  { id: "p1", points: 100, price: 100, bonus: 0 },
  { id: "p2", points: 500, price: 450, bonus: 50 },
  { id: "p3", points: 1000, price: 850, bonus: 150 },
  { id: "p4", points: 5000, price: 4000, bonus: 1000 },
]

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">プラン & 料金</h1>
        <p className="text-muted-foreground mt-2">
          あなたに最適なプランを選んでください
        </p>
      </div>

      {/* プラン比較 */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const IconComponent = plan.icon
          return (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    人気
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full ${
                    plan.current ? 'bg-green-100' : 'bg-primary/10'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      plan.current ? 'text-green-600' : 'text-primary'
                    }`} />
                  </div>
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold">無料</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">¥{plan.price.toLocaleString()}</span>
                      <span className="text-muted-foreground">/月</span>
                    </>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ポイント購入 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            ポイント購入
          </CardTitle>
          <CardDescription>
            ポイントは様々な機能の解放や特典の獲得に使用できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {pointPackages.map((pkg) => (
              <Card key={pkg.id} className="text-center">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary">{pkg.points.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">ポイント</p>
                  {pkg.bonus > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      +{pkg.bonus}ボーナス
                    </p>
                  )}
                  <p className="text-lg font-semibold mt-2">¥{pkg.price.toLocaleString()}</p>
                  <Button size="sm" className="mt-3 w-full">
                    購入
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>よくある質問</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">プランはいつでも変更できますか？</h4>
            <p className="text-sm text-muted-foreground mt-1">
              はい、いつでもアップグレード・ダウングレードが可能です。変更は次の請求サイクルから適用されます。
            </p>
          </div>
          <div>
            <h4 className="font-medium">支払い方法は何が使えますか？</h4>
            <p className="text-sm text-muted-foreground mt-1">
              クレジットカード（Visa, Mastercard, JCB, AMEX）、銀行振込、PayPayに対応しています。
            </p>
          </div>
          <div>
            <h4 className="font-medium">解約するとデータはどうなりますか？</h4>
            <p className="text-sm text-muted-foreground mt-1">
              有料プランを解約してもアカウントとデータは保持されます。フリープランとして引き続きご利用いただけます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* サポートリンク */}
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          ご不明な点がございましたらお気軽にお問い合わせください
        </p>
        <Button variant="outline" asChild>
          <Link href="/help/contact">
            <CreditCard className="h-4 w-4 mr-2" />
            お問い合わせ
          </Link>
        </Button>
      </div>
    </div>
  )
}
