import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, MapPin, Globe, Clock, Award, Users } from 'lucide-react'

/**
 * 公開ルートアカウントページ
 *
 * 設計書に基づく公開ルートアカウント表示
 * - 基本情報（表示名、地域、世代）
 * - 公開プロフィール一覧
 * - 実績・バッジ
 */

// モックデータ
const mockRootAccount = {
  id: 'test-root-account-123',
  displayName: 'サンプルユーザー',
  location: '東京都',
  language: '日本語',
  generation: '1990年代',
  joinedAt: '2024-01-15',
  totalPoints: 2500,
  profiles: [
    {
      id: 'profile-1',
      name: 'ビジネスプロフィール',
      purpose: '仕事・キャリア',
      bio: 'Web開発を専門としています',
      isPublic: true,
    },
    {
      id: 'profile-2',
      name: 'クリエイタープロフィール',
      purpose: '創作活動',
      bio: 'イラストと音楽制作が趣味',
      isPublic: true,
    },
  ],
  achievements: [
    { id: 'ach-1', name: '初陣', description: '初めての組織を作成', unlocked: true, unlockedAt: '2024-02-01' },
    { id: 'ach-2', name: '人気者', description: 'メンバー10人達成', unlocked: true, unlockedAt: '2024-03-15' },
    { id: 'ach-3', name: '大国建設者', description: '国を建国する', unlocked: false, unlockedAt: null },
    { id: 'ach-4', name: 'アクティブ', description: '30日連続ログイン', unlocked: true, unlockedAt: '2024-04-20' },
  ],
  stats: {
    organizations: 3,
    nations: 1,
    works: 12,
  },
}

interface PageProps {
  params: Promise<{ rootAccountId: string }>
}

export default async function PublicRootAccountPage({ params }: PageProps) {
  const { rootAccountId } = await params

  // TODO: DBからルートアカウントを取得
  // const rootAccount = await getPublicRootAccount(rootAccountId)
  const rootAccount = mockRootAccount

  const unlockedAchievements = rootAccount.achievements.filter(a => a.unlocked)
  const lockedAchievements = rootAccount.achievements.filter(a => !a.unlocked)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">公開ルートアカウント</h1>
      </div>

      {/* 基本情報カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            基本情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* アバター */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-gray-400" />
            </div>

            {/* 情報 */}
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold">{rootAccount.displayName}</h2>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {rootAccount.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {rootAccount.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {rootAccount.language}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {rootAccount.generation}生まれ
                </span>
              </div>

              {/* 統計 */}
              <div className="flex gap-6 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold">{rootAccount.stats.organizations}</p>
                  <p className="text-xs text-muted-foreground">組織</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{rootAccount.stats.nations}</p>
                  <p className="text-xs text-muted-foreground">国家</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{rootAccount.stats.works}</p>
                  <p className="text-xs text-muted-foreground">作品</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 公開プロフィール一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            公開プロフィール
          </CardTitle>
          <CardDescription>
            このアカウントが持つ公開プロフィール
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {rootAccount.profiles.filter(p => p.isPublic).map((profile) => (
              <Link
                key={profile.id}
                href={`/user-profiles/${profile.id}`}
                className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{profile.name}</h4>
                    <Badge variant="outline" className="text-xs">{profile.purpose}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 実績・バッジ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            実績・バッジ
          </CardTitle>
          <CardDescription>
            獲得した実績: {unlockedAchievements.length} / {rootAccount.achievements.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 解除済み実績 */}
            {unlockedAchievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">獲得済み</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">{achievement.name}</h5>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 未解除実績 */}
            {lockedAchievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">未獲得</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {lockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 opacity-60"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Award className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <h5 className="font-medium">{achievement.name}</h5>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
