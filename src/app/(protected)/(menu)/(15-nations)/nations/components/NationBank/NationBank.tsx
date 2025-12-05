"use client"

/**
 * 国銀行コンポーネント
 * 設計書: 0130-02-国の内政設計書.md
 *
 * 機能:
 * - 通帳風インターフェース
 * - 入金・出金・送金
 * - 取引履歴表示
 * - ローン申請・返済
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  History,
  CreditCard,
  PiggyBank,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

// =====================================================
// 型定義
// =====================================================

export interface BankAccount {
  id: string
  ownerType: "user" | "organization" | "nation"
  ownerId: string
  ownerName: string
  balance: number
  createdAt: string
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer" | "loan_disbursement" | "loan_repayment" | "tax" | "reward"
  amount: number
  balanceAfter: number
  description?: string
  counterpartyName?: string
  createdAt: string
}

export interface Loan {
  id: string
  principalAmount: number
  interestRate: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  status: "active" | "paid" | "defaulted"
  dueDate: string
  createdAt: string
}

export interface NationBankProps {
  account: BankAccount
  transactions?: Transaction[]
  loans?: Loan[]
  availableTransferTargets?: Array<{ id: string; name: string; type: string }>
  maxLoanAmount?: number
  onDeposit?: (amount: number) => Promise<void>
  onWithdraw?: (amount: number) => Promise<void>
  onTransfer?: (targetId: string, amount: number, description?: string) => Promise<void>
  onApplyLoan?: (amount: number) => Promise<void>
  onRepayLoan?: (loanId: string, amount: number) => Promise<void>
  isLoading?: boolean
}

// =====================================================
// ヘルパー関数
// =====================================================

const formatNumber = (num: number): string => {
  return num.toLocaleString("ja-JP")
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getTransactionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    deposit: "入金",
    withdrawal: "出金",
    transfer: "送金",
    loan_disbursement: "ローン受取",
    loan_repayment: "ローン返済",
    tax: "税金",
    reward: "報酬",
  }
  return labels[type] || type
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "deposit":
    case "reward":
    case "loan_disbursement":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    case "withdrawal":
    case "transfer":
    case "loan_repayment":
    case "tax":
      return <ArrowUpRight className="h-4 w-4 text-red-600" />
    default:
      return <History className="h-4 w-4" />
  }
}

const getLoanStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="text-blue-600"><Clock className="h-3 w-3 mr-1" />返済中</Badge>
    case "paid":
      return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />完済</Badge>
    case "defaulted":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />延滞</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// =====================================================
// サブコンポーネント
// =====================================================

function DepositDialog({
  onDeposit,
  isLoading,
}: {
  onDeposit?: (amount: number) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")

  const handleSubmit = async () => {
    if (!onDeposit || !amount) return
    await onDeposit(Number(amount))
    setAmount("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <ArrowDownLeft className="h-4 w-4 mr-2" />
          入金
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>入金</DialogTitle>
          <DialogDescription>
            個人ウォレットから銀行口座に入金します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">入金額</Label>
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || Number(amount) <= 0 || isLoading}
          >
            入金する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WithdrawDialog({
  balance,
  onWithdraw,
  isLoading,
}: {
  balance: number
  onWithdraw?: (amount: number) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")

  const handleSubmit = async () => {
    if (!onWithdraw || !amount) return
    await onWithdraw(Number(amount))
    setAmount("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          出金
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>出金</DialogTitle>
          <DialogDescription>
            銀行口座から個人ウォレットに出金します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">出金額</Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              max={balance}
            />
            <p className="text-xs text-muted-foreground">
              出金可能額: {formatNumber(balance)} ポイント
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || Number(amount) <= 0 || Number(amount) > balance || isLoading}
          >
            出金する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TransferDialog({
  balance,
  targets = [],
  onTransfer,
  isLoading,
}: {
  balance: number
  targets?: Array<{ id: string; name: string; type: string }>
  onTransfer?: (targetId: string, amount: number, description?: string) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [targetId, setTargetId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    if (!onTransfer || !targetId || !amount) return
    await onTransfer(targetId, Number(amount), description || undefined)
    setTargetId("")
    setAmount("")
    setDescription("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Send className="h-4 w-4 mr-2" />
          送金
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>送金</DialogTitle>
          <DialogDescription>
            他のユーザーまたは組織に送金します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="transfer-target">送金先</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger id="transfer-target">
                <SelectValue placeholder="送金先を選択" />
              </SelectTrigger>
              <SelectContent>
                {targets.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name} ({target.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-amount">送金額</Label>
            <Input
              id="transfer-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              max={balance}
            />
            <p className="text-xs text-muted-foreground">
              送金可能額: {formatNumber(balance)} ポイント
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-desc">メモ（任意）</Label>
            <Input
              id="transfer-desc"
              placeholder="送金理由など"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!targetId || !amount || Number(amount) <= 0 || Number(amount) > balance || isLoading}
          >
            送金する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LoanDialog({
  maxAmount = 0,
  onApplyLoan,
  isLoading,
}: {
  maxAmount?: number
  onApplyLoan?: (amount: number) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")

  const handleSubmit = async () => {
    if (!onApplyLoan || !amount) return
    await onApplyLoan(Number(amount))
    setAmount("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CreditCard className="h-4 w-4 mr-2" />
          ローン申請
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ローン申請</DialogTitle>
          <DialogDescription>
            国の銀行からローンを借り入れます
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span>借入可能額: 最大 {formatNumber(maxAmount)} ポイント</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              ローンには利息が発生します。期日までに返済しない場合、ペナルティが課されます。
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-amount">借入額</Label>
            <Input
              id="loan-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              max={maxAmount}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || Number(amount) <= 0 || Number(amount) > maxAmount || isLoading}
          >
            申請する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        取引履歴がありません
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">日時</TableHead>
            <TableHead>種別</TableHead>
            <TableHead>摘要</TableHead>
            <TableHead className="text-right">金額</TableHead>
            <TableHead className="text-right">残高</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="text-xs text-muted-foreground">
                {formatDateTime(tx.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTransactionIcon(tx.type)}
                  <span className="text-sm">{getTransactionTypeLabel(tx.type)}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {tx.description || tx.counterpartyName || "-"}
              </TableCell>
              <TableCell className={`text-right font-mono ${
                ["deposit", "reward", "loan_disbursement"].includes(tx.type)
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {["deposit", "reward", "loan_disbursement"].includes(tx.type) ? "+" : "-"}
                {formatNumber(tx.amount)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(tx.balanceAfter)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function LoanList({
  loans,
  onRepay,
  isLoading,
}: {
  loans: Loan[]
  onRepay?: (loanId: string, amount: number) => Promise<void>
  isLoading?: boolean
}) {
  const [repayDialogOpen, setRepayDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [repayAmount, setRepayAmount] = useState("")

  const handleRepay = async () => {
    if (!onRepay || !selectedLoan || !repayAmount) return
    await onRepay(selectedLoan.id, Number(repayAmount))
    setRepayAmount("")
    setSelectedLoan(null)
    setRepayDialogOpen(false)
  }

  const activeLoans = loans.filter((l) => l.status === "active")
  const pastLoans = loans.filter((l) => l.status !== "active")

  return (
    <div className="space-y-6">
      {activeLoans.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">返済中のローン</h4>
          <div className="space-y-3">
            {activeLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatNumber(loan.principalAmount)} ポイント
                        </span>
                        {getLoanStatusBadge(loan.status)}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        利率: {loan.interestRate}% |
                        返済残: {formatNumber(loan.remainingAmount)} ポイント
                      </div>
                      <div className="text-xs text-muted-foreground">
                        返済期日: {formatDate(loan.dueDate)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLoan(loan)
                        setRepayDialogOpen(true)
                      }}
                    >
                      返済する
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastLoans.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">過去のローン</h4>
          <div className="space-y-2">
            {pastLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <span className="text-sm">
                    {formatNumber(loan.principalAmount)} ポイント
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDate(loan.createdAt)}
                  </span>
                </div>
                {getLoanStatusBadge(loan.status)}
              </div>
            ))}
          </div>
        </div>
      )}

      {loans.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          ローン履歴がありません
        </div>
      )}

      {/* 返済ダイアログ */}
      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ローン返済</DialogTitle>
            <DialogDescription>
              返済額を入力してください
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm">
                  <div>元本: {formatNumber(selectedLoan.principalAmount)} ポイント</div>
                  <div>返済残高: {formatNumber(selectedLoan.remainingAmount)} ポイント</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="repay-amount">返済額</Label>
                <Input
                  id="repay-amount"
                  type="number"
                  placeholder="0"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  min={1}
                  max={selectedLoan.remainingAmount}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRepayDialogOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleRepay}
              disabled={!repayAmount || Number(repayAmount) <= 0 || isLoading}
            >
              返済する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// =====================================================
// メインコンポーネント
// =====================================================

export function NationBank({
  account,
  transactions = [],
  loans = [],
  availableTransferTargets = [],
  maxLoanAmount = 0,
  onDeposit,
  onWithdraw,
  onTransfer,
  onApplyLoan,
  onRepayLoan,
  isLoading = false,
}: NationBankProps) {
  const [activeTab, setActiveTab] = useState("transactions")

  return (
    <div className="space-y-6">
      {/* 通帳風ヘッダー */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-full">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{account.ownerName}</CardTitle>
              <CardDescription>
                {account.ownerType === "user" ? "個人口座" :
                 account.ownerType === "organization" ? "組織口座" : "国庫"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">口座残高</p>
              <p className="text-4xl font-bold">
                {formatNumber(account.balance)}
                <span className="text-lg ml-2">ポイント</span>
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              開設日: {formatDate(account.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex gap-2">
        <DepositDialog onDeposit={onDeposit} isLoading={isLoading} />
        <WithdrawDialog
          balance={account.balance}
          onWithdraw={onWithdraw}
          isLoading={isLoading}
        />
        <TransferDialog
          balance={account.balance}
          targets={availableTransferTargets}
          onTransfer={onTransfer}
          isLoading={isLoading}
        />
      </div>

      {/* タブコンテンツ */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="w-full">
              <TabsTrigger value="transactions" className="flex-1">
                <History className="h-4 w-4 mr-2" />
                取引履歴
              </TabsTrigger>
              <TabsTrigger value="loans" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                ローン
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="transactions" className="mt-0">
              <TransactionHistory transactions={transactions} />
            </TabsContent>

            <TabsContent value="loans" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>借入可能額: {formatNumber(maxLoanAmount)} ポイント</span>
                  </div>
                  <LoanDialog
                    maxAmount={maxLoanAmount}
                    onApplyLoan={onApplyLoan}
                    isLoading={isLoading}
                  />
                </div>
                <LoanList
                  loans={loans}
                  onRepay={onRepayLoan}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default NationBank
