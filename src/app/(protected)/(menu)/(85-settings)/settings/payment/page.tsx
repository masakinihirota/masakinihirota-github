import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Plus, Check } from "lucide-react"

/**
 * 支払い設定ページ
 */

// モックプラン情報
const currentPlan = {
  name: "フリープラン",
  price: "¥0",
  period: "/月",
  features: [
    "プロフィール 10個まで",
    "基本的なマッチング機能",
    "作品登録 50件まで",
  ],
}

const upgradePlan = {
  name: "プロプラン",
  price: "¥980",
  period: "/月",
  features: [
    "プロフィール 30個まで",
    "高度なマッチング機能",
    "作品登録 無制限",
    "優先サポート",
    "広告非表示",
  ],
}

// モックポイント情報
const mockPoints = {
  balance: 1250,
  history: [
    { id: "1", type: "earned", amount: 100, description: "作品登録ボーナス", date: "2025-12-01" },
    { id: "2", type: "spent", amount: -50, description: "プロフィール追加", date: "2025-11-28" },
    { id: "3", type: "earned", amount: 200, description: "マッチング成功ボーナス", date: "2025-11-25" },
  ],
}

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">支払い設定</h1>
          <p className="text-muted-foreground mt-1">
            プランとポイントを管理します
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* 現在のプラン */}
        <Card>
          <CardHeader>
            <CardTitle>現在のプラン</CardTitle>
            <CardDescription>
              ご利用中のサブスクリプション
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <p className="text-lg font-semibold">{currentPlan.name}</p>
                <p className="text-2xl font-bold">
                  {currentPlan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {currentPlan.period}
                  </span>
                </p>
                <ul className="mt-2 space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アップグレード */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              プランをアップグレード
            </CardTitle>
            <CardDescription>
              より多くの機能をご利用いただけます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-lg font-semibold">{upgradePlan.name}</p>
                <p className="text-2xl font-bold">
                  {upgradePlan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {upgradePlan.period}
                  </span>
                </p>
                <ul className="mt-2 space-y-1">
                  {upgradePlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button>
                アップグレード
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ポイント残高 */}
        <Card>
          <CardHeader>
            <CardTitle>ポイント残高</CardTitle>
            <CardDescription>
              獲得したポイントと履歴
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">現在のポイント</p>
                <p className="text-3xl font-bold">{mockPoints.balance.toLocaleString()} pt</p>
              </div>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                ポイント購入
              </Button>
            </div>

            <div className="space-y-3">
              <p className="font-medium">最近の履歴</p>
              {mockPoints.history.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={`font-semibold ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount} pt
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
