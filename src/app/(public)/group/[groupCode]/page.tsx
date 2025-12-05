import { notFound } from 'next/navigation'
import { getOrganizationByGroupCode } from '@/lib/organization/getOrganizationByGroupCode'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Users, Calendar } from 'lucide-react'

interface GroupPageProps {
  params: Promise<{ groupCode: string }>
}

/**
 * 公開組織ページ
 * グループコードから組織の公開情報を表示
 */
export default async function GroupPage({ params }: GroupPageProps) {
  const { groupCode } = await params

  const organization = await getOrganizationByGroupCode(groupCode)

  if (!organization) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        トップへ戻る
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{organization.name}</CardTitle>
              <CardDescription className="mt-2">
                {organization.description || '説明はありません'}
              </CardDescription>
            </div>
            <Badge variant="secondary">組織</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>メンバー数: -</span>
              </div>
              {organization.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    作成日: {new Date(organization.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button asChild>
                <Link href={`/login?redirect=/organizations/${organization.id}`}>
                  ログインして詳細を見る
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: '組織情報',
  description: '公開組織の詳細情報',
}
