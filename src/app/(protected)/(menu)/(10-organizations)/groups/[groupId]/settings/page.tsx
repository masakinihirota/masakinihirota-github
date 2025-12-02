import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, RefreshCw, Copy, Trash2 } from "lucide-react"

/**
 * 組織設定ページ
 */

// モックデータ
const mockGroupSettings = {
  inviteCode: "ABC123",
  isPublic: true,
  requireApproval: true,
  maxMembers: 50,
  allowInvites: true,
}

interface GroupSettingsPageProps {
  params: Promise<{ groupId: string }>
}

export default async function GroupSettingsPage({ params }: GroupSettingsPageProps) {
  const { groupId } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/groups/${groupId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">組織設定</h1>
          <p className="text-muted-foreground mt-1">
            組織のルールと設定を管理します
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* 招待コード */}
        <Card>
          <CardHeader>
            <CardTitle>招待コード</CardTitle>
            <CardDescription>
              メンバーを招待するためのコードを管理します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={mockGroupSettings.inviteCode}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              このコードを共有すると、他のユーザーが組織に参加できます
            </p>
          </CardContent>
        </Card>

        {/* 公開設定 */}
        <Card>
          <CardHeader>
            <CardTitle>公開設定</CardTitle>
            <CardDescription>
              組織の公開範囲を設定します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>組織を公開</Label>
                <p className="text-sm text-muted-foreground">
                  検索結果に表示され、誰でも閲覧可能になります
                </p>
              </div>
              <Switch defaultChecked={mockGroupSettings.isPublic} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>参加承認が必要</Label>
                <p className="text-sm text-muted-foreground">
                  新規メンバーの参加にはリーダーの承認が必要です
                </p>
              </div>
              <Switch defaultChecked={mockGroupSettings.requireApproval} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>メンバーによる招待を許可</Label>
                <p className="text-sm text-muted-foreground">
                  リーダー以外のメンバーも新規メンバーを招待できます
                </p>
              </div>
              <Switch defaultChecked={mockGroupSettings.allowInvites} />
            </div>
          </CardContent>
        </Card>

        {/* メンバー制限 */}
        <Card>
          <CardHeader>
            <CardTitle>メンバー制限</CardTitle>
            <CardDescription>
              組織のメンバー数を制限します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxMembers">最大メンバー数</Label>
              <Input
                id="maxMembers"
                type="number"
                defaultValue={mockGroupSettings.maxMembers}
                min={2}
                max={1000}
              />
            </div>
          </CardContent>
        </Card>

        {/* 危険な操作 */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">危険な操作</CardTitle>
            <CardDescription>
              これらの操作は取り消すことができません
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              組織を解散
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            設定を保存
          </Button>
        </div>
      </div>
    </div>
  )
}
