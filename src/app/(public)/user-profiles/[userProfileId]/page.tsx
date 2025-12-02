import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Briefcase, Star, Users, MapPin, Calendar, ExternalLink } from 'lucide-react'

/**
 * 公開プロフィールページ
 *
 * 設計書 0110-02 に基づく公開プロフィール表示
 * - 基本情報（名前、自己紹介）
 * - スキル・専門分野
 * - 作品・実績
 * - 所属組織・国
 * - ゲーミフィケーション（レベル、バッジ）
 */

// モックデータ（後でDBから取得に置き換え）
const mockProfile = {
  id: 'test-profile-123',
  name: 'サンプルユーザー',
  bio: 'Webエンジニアとして5年以上の経験があります。フロントエンド開発が得意で、React/Next.jsを使ったモダンなWebアプリケーション開発に取り組んでいます。',
  avatarUrl: null,
  location: '東京都',
  joinedAt: '2024-01-15',
  level: 12,
  badges: ['初期メンバー', 'アクティブ', '貢献者'],
  skills: [
    { name: 'React', tier: 'expert' },
    { name: 'TypeScript', tier: 'expert' },
    { name: 'Next.js', tier: 'advanced' },
    { name: 'Node.js', tier: 'intermediate' },
    { name: 'PostgreSQL', tier: 'intermediate' },
  ],
  works: [
    {
      id: 'work-1',
      title: 'ECサイトリニューアル',
      description: '大手小売業のECサイトをNext.jsでフルリニューアル',
      tense: '今',
    },
    {
      id: 'work-2',
      title: 'オープンソース貢献',
      description: 'React関連ライブラリへのPR提出・マージ',
      tense: '人生',
    },
  ],
  organizations: [
    { id: 'org-1', name: 'テックコミュニティA', role: 'メンバー' },
    { id: 'org-2', name: 'デザイン研究会', role: 'サブリーダー' },
  ],
  nations: [
    { id: 'nation-1', name: 'クリエイター国家', status: 'resident' },
  ],
}

function getTierColor(tier: string) {
  switch (tier) {
    case 'expert':
      return 'bg-purple-100 text-purple-800'
    case 'advanced':
      return 'bg-blue-100 text-blue-800'
    case 'intermediate':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getTierLabel(tier: string) {
  switch (tier) {
    case 'expert':
      return 'エキスパート'
    case 'advanced':
      return '上級'
    case 'intermediate':
      return '中級'
    default:
      return '入門'
  }
}

interface PageProps {
  params: Promise<{ userProfileId: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { userProfileId } = await params

  // TODO: DBからプロフィールを取得
  // const profile = await getPublicProfile(userProfileId)
  const profile = mockProfile

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">公開プロフィール</h1>
      </div>

      {/* 基本情報カード */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* アバター */}
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>

            {/* プロフィール情報 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <Badge variant="secondary">Lv.{profile.level}</Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {profile.joinedAt} 参加
                </span>
              </div>

              <p className="text-muted-foreground">{profile.bio}</p>

              {/* バッジ */}
              {profile.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.badges.map((badge) => (
                    <Badge key={badge} variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スキル・専門分野 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            スキル・専門分野
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill) => (
              <div
                key={skill.name}
                className={`px-3 py-2 rounded-lg ${getTierColor(skill.tier)}`}
              >
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs ml-2 opacity-75">{getTierLabel(skill.tier)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 作品・実績 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            作品・実績
          </CardTitle>
          <CardDescription>
            これまでの活動と成果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.works.map((work) => (
              <div key={work.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{work.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {work.tense}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{work.description}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/works/${work.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 所属 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            所属
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* 組織 */}
            {profile.organizations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">組織</h4>
                <div className="space-y-2">
                  {profile.organizations.map((org) => (
                    <Link
                      key={org.id}
                      href={`/groups/${org.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span>{org.name}</span>
                      <Badge variant="secondary">{org.role}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 国 */}
            {profile.nations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">国家</h4>
                <div className="space-y-2">
                  {profile.nations.map((nation) => (
                    <Link
                      key={nation.id}
                      href={`/nations/${nation.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span>{nation.name}</span>
                      <Badge variant={nation.status === 'resident' ? 'default' : 'secondary'}>
                        {nation.status === 'resident' ? '常駐' : '一時参加'}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex gap-3">
        <Button>マッチング申請</Button>
        <Button variant="outline">メッセージを送る</Button>
      </div>
    </div>
  )
}
