import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, AlertTriangle, Calendar } from "lucide-react"

/**
 * 国の維持ポイント管理ページ
 */

// モックデータ
const mockFinance = {
  balance: 45000,
  monthlyFee: 1000,
  nextPaymentDate: "2026-01-01",
  paidUntil: "2025-12-31",
}

const mockTransactions = [
  { id: "1", type: "payment", amount: -1000, description: "月額維持費", date: "2025-12-01" },
  { id: "2", type: "income", amount: 500, description: "新規組織参加ボーナス", date: "2025-11-28" },
  { id: "3", type: "payment", amount: -1000, description: "月額維持費", date: "2025-11-01" },
  { id: "4", type: "penalty", amount: -200, description: "ペナルティ: ルール違反報告", date: "2025-10-25" },
  { id: "5", type: "income", amount: 1000, description: "イベント開催報酬", date: "2025-10-20" },
]

interface NationFinancePageProps {
  params: Promise<{ nation_id: string }>
}

export default async function NationFinancePage({ params }: NationFinancePageProps) {
  const { nation_id } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/nations/${nation_id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">維持ポイント管理</h1>
          <p className="text-muted-foreground mt-1">
            国の財務状況を管理します
          </p>
        </div>
      </div>

      {/* 概要カード */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              ポイント残高
            </CardDescription>
            <CardTitle className="text-3xl">{mockFinance.balance.toLocaleString()} pt</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              月額維持費
            </CardDescription>
            <CardTitle className="text-3xl">{mockFinance.monthlyFee.toLocaleString()} pt</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              支払済み期間
            </CardDescription>
            <CardTitle className="text-xl">〜{mockFinance.paidUntil}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              維持可能期間
            </CardDescription>
            <CardTitle className="text-3xl">{Math.floor(mockFinance.balance / mockFinance.monthlyFee)} ヶ月</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 警告 */}
      {mockFinance.balance < mockFinance.monthlyFee * 3 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="h-5 w-5" />
              ポイント残高が少なくなっています
            </CardTitle>
            <CardDescription className="text-yellow-600 dark:text-yellow-400">
              維持費の支払いが滞ると、国の運営に影響が出る可能性があります。
              早めにポイントを追加してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>ポイントを追加</Button>
          </CardContent>
        </Card>
      )}

      {/* 取引履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>取引履歴</CardTitle>
          <CardDescription>
            ポイントの入出金履歴
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : tx.type === 'penalty'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tx.type === 'income' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} pt
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            すべての履歴を表示
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
