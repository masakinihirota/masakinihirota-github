"use client"

/**
 * 国マーケット（掲示板）コンポーネント
 * 設計書: 0130-02-国の内政設計書.md
 *
 * 機能:
 * - タスク/求人投稿
 * - 応募・マッチング
 * - 報酬支払い
 * - 評価システム
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Briefcase,
  Plus,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Coins,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

// =====================================================
// 型定義
// =====================================================

export interface MarketPost {
  id: string
  title: string
  description: string
  category: string
  reward: number
  status: "open" | "in_progress" | "completed" | "cancelled"
  posterId: string
  posterName: string
  posterAvatarUrl?: string
  applicantCount: number
  createdAt: string
  deadline?: string
}

export interface Application {
  id: string
  postId: string
  postTitle: string
  applicantId: string
  applicantName: string
  applicantAvatarUrl?: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
}

export interface Rating {
  id: string
  postId: string
  raterId: string
  raterName: string
  targetId: string
  targetName: string
  score: number // 1-5
  comment?: string
  createdAt: string
}

export interface NationMarketProps {
  nationId: string
  posts?: MarketPost[]
  myApplications?: Application[]
  categories?: string[]
  currentUserId?: string
  onCreatePost?: (data: {
    title: string
    description: string
    category: string
    reward: number
    deadline?: string
  }) => Promise<void>
  onApply?: (postId: string, message?: string) => Promise<void>
  onAcceptApplication?: (applicationId: string) => Promise<void>
  onRejectApplication?: (applicationId: string) => Promise<void>
  onComplete?: (postId: string) => Promise<void>
  onRate?: (postId: string, targetId: string, score: number, comment?: string) => Promise<void>
  onClosePost?: (postId: string) => Promise<void>
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
    month: "short",
    day: "numeric",
  })
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="default" className="bg-green-600">募集中</Badge>
    case "in_progress":
      return <Badge variant="outline" className="text-blue-600 border-blue-600">進行中</Badge>
    case "completed":
      return <Badge variant="secondary">完了</Badge>
    case "cancelled":
      return <Badge variant="destructive">キャンセル</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getApplicationStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />審査中</Badge>
    case "accepted":
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />承認</Badge>
    case "rejected":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />却下</Badge>
    case "completed":
      return <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />完了</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const DEFAULT_CATEGORIES = [
  "開発・プログラミング",
  "デザイン",
  "翻訳・ライティング",
  "マーケティング",
  "コンサルティング",
  "その他",
]

// =====================================================
// サブコンポーネント
// =====================================================

function CreatePostDialog({
  categories = DEFAULT_CATEGORIES,
  onCreate,
  isLoading,
}: {
  categories?: string[]
  onCreate?: (data: {
    title: string
    description: string
    category: string
    reward: number
    deadline?: string
  }) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [reward, setReward] = useState("")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = async () => {
    if (!onCreate || !title || !description || !category || !reward) return
    await onCreate({
      title,
      description,
      category,
      reward: Number(reward),
      deadline: deadline || undefined,
    })
    setTitle("")
    setDescription("")
    setCategory("")
    setReward("")
    setDeadline("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          投稿を作成
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>タスクを投稿</DialogTitle>
          <DialogDescription>
            仕事やタスクを募集します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">タイトル</Label>
            <Input
              id="post-title"
              placeholder="タスクのタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-category">カテゴリ</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="post-category">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-description">詳細説明</Label>
            <Textarea
              id="post-description"
              placeholder="タスクの詳細を説明してください"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="post-reward">報酬（ポイント）</Label>
              <Input
                id="post-reward"
                type="number"
                placeholder="0"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-deadline">締め切り（任意）</Label>
              <Input
                id="post-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !description || !category || !reward || isLoading}
          >
            投稿する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ApplyDialog({
  post,
  onApply,
  isLoading,
}: {
  post: MarketPost
  onApply?: (postId: string, message?: string) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    if (!onApply) return
    await onApply(post.id, message || undefined)
    setMessage("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">応募する</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>応募する</DialogTitle>
          <DialogDescription>
            「{post.title}」に応募します
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span>報酬: {formatNumber(post.reward)} ポイント</span>
              </div>
              {post.deadline && (
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>締め切り: {formatDate(post.deadline)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apply-message">メッセージ（任意）</Label>
            <Textarea
              id="apply-message"
              placeholder="自己PRやコメントを入力してください"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            応募する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RatingDialog({
  postId,
  targetId,
  targetName,
  onRate,
  isLoading,
}: {
  postId: string
  targetId: string
  targetName: string
  onRate?: (postId: string, targetId: string, score: number, comment?: string) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState("")

  const handleSubmit = async () => {
    if (!onRate) return
    await onRate(postId, targetId, score, comment || undefined)
    setScore(5)
    setComment("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4 mr-1" />
          評価する
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>評価</DialogTitle>
          <DialogDescription>
            {targetName}さんを評価してください
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>評価</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= score
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating-comment">コメント（任意）</Label>
            <Textarea
              id="rating-comment"
              placeholder="感想やフィードバックを入力してください"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            送信する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PostCard({
  post,
  currentUserId,
  onApply,
  onComplete,
  onClosePost,
  onRate,
  isLoading,
}: {
  post: MarketPost
  currentUserId?: string
  onApply?: (postId: string, message?: string) => Promise<void>
  onComplete?: (postId: string) => Promise<void>
  onClosePost?: (postId: string) => Promise<void>
  onRate?: (postId: string, targetId: string, score: number, comment?: string) => Promise<void>
  isLoading?: boolean
}) {
  const isOwner = post.posterId === currentUserId

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{post.title}</CardTitle>
              {getStatusBadge(post.status)}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {post.category}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-lg font-bold text-yellow-600">
            <Coins className="h-5 w-5" />
            {formatNumber(post.reward)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.posterAvatarUrl} />
              <AvatarFallback>{post.posterName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span>{post.posterName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>応募 {post.applicantCount}件</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>締切: {formatDate(post.deadline)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full justify-end">
          {post.status === "open" && !isOwner && onApply && (
            <ApplyDialog post={post} onApply={onApply} isLoading={isLoading} />
          )}
          {post.status === "in_progress" && isOwner && onComplete && (
            <Button
              size="sm"
              onClick={() => onComplete(post.id)}
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              完了にする
            </Button>
          )}
          {post.status === "open" && isOwner && onClosePost && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClosePost(post.id)}
              disabled={isLoading}
            >
              募集を終了
            </Button>
          )}
          {post.status === "completed" && onRate && (
            <RatingDialog
              postId={post.id}
              targetId={post.posterId}
              targetName={post.posterName}
              onRate={onRate}
              isLoading={isLoading}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function ApplicationList({
  applications,
  onAccept,
  onReject,
  isLoading,
}: {
  applications: Application[]
  onAccept?: (id: string) => Promise<void>
  onReject?: (id: string) => Promise<void>
  isLoading?: boolean
}) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        応募履歴がありません
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <Card key={app.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={app.applicantAvatarUrl} />
                    <AvatarFallback>
                      {app.applicantName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{app.postTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </div>
                  </div>
                </div>
                {app.message && (
                  <p className="mt-2 text-sm text-muted-foreground pl-10">
                    {app.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getApplicationStatusBadge(app.status)}
                {app.status === "pending" && onAccept && onReject && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onReject(app.id)}
                      disabled={isLoading}
                    >
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onAccept(app.id)}
                      disabled={isLoading}
                    >
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// =====================================================
// メインコンポーネント
// =====================================================

export function NationMarket({
  nationId,
  posts = [],
  myApplications = [],
  categories = DEFAULT_CATEGORIES,
  currentUserId,
  onCreatePost,
  onApply,
  onAcceptApplication,
  onRejectApplication,
  onComplete,
  onRate,
  onClosePost,
  isLoading = false,
}: NationMarketProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  // フィルタリング
  const filteredPosts = posts.filter((post) => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filterCategory && post.category !== filterCategory) {
      return false
    }
    if (filterStatus && post.status !== filterStatus) {
      return false
    }
    return true
  })

  const openPosts = filteredPosts.filter((p) => p.status === "open")
  const myPosts = filteredPosts.filter((p) => p.posterId === currentUserId)

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            マーケット
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            タスクや仕事を掲載・応募できます
          </p>
        </div>
        {onCreatePost && (
          <CreatePostDialog
            categories={categories}
            onCreate={onCreatePost}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="タイトルで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterCategory || "all"}
          onValueChange={(v) => setFilterCategory(v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのカテゴリ</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterStatus || "all"}
          onValueChange={(v) => setFilterStatus(v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="open">募集中</SelectItem>
            <SelectItem value="in_progress">進行中</SelectItem>
            <SelectItem value="completed">完了</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            募集中 ({openPosts.length})
          </TabsTrigger>
          <TabsTrigger value="my-posts" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            自分の投稿 ({myPosts.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            応募履歴 ({myApplications.length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="posts" className="mt-0">
            {openPosts.length > 0 ? (
              <div className="space-y-4">
                {openPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                    onApply={onApply}
                    onRate={onRate}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>募集中の投稿がありません</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-posts" className="mt-0">
            {myPosts.length > 0 ? (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                    onComplete={onComplete}
                    onClosePost={onClosePost}
                    onRate={onRate}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>投稿がありません</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="mt-0">
            <ApplicationList
              applications={myApplications}
              onAccept={onAcceptApplication}
              onReject={onRejectApplication}
              isLoading={isLoading}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default NationMarket
