"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCircle,
  Heart,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  Activity,
} from "lucide-react"

export type OrganizationMember = {
  id: string
  name: string
  role: string
}

export type OrganizationDetailData = {
  id: string
  name: string
  type: string
  purpose: string
  representative: string
  memberCount: number
  maxMembers: number
  followerCount: number
  status: string
  vision: string
  mission: string
  activities: string
  location: string
  foundedAt: string
  description: string
  members: OrganizationMember[]
}

type OrganizationDetailProps = {
  organization: OrganizationDetailData
}

export function OrganizationDetail({ organization }: OrganizationDetailProps) {
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーエリア */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">
                  {organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{organization.name}</CardTitle>
                  <Badge variant="secondary">{organization.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCircle className="h-4 w-4" />
                  <span>代表: {organization.representative}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                フォロー
              </Button>
              <Button>加入リクエスト</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {organization.memberCount}/{organization.maxMembers} メンバー
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span>{organization.followerCount} フォロワー</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{organization.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>設立: {formatDate(organization.foundedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 概要セクション */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              ビジョン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{organization.vision}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5" />
              ミッション
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{organization.mission}</p>
          </CardContent>
        </Card>
      </div>

      {/* 活動内容 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            活動内容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{organization.activities}</p>
        </CardContent>
      </Card>

      {/* メンバー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            メンバー ({organization.members.length}人)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {organization.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <Avatar>
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 説明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">説明</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{organization.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
