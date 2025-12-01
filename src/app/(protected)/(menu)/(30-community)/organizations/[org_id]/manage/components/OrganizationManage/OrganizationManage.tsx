"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  joinedAt: string;
  penaltyStatus?: string | null;
}

interface Organization {
  id: string;
  name: string;
}

interface OrganizationManageProps {
  organization: Organization;
  members: Member[];
  onInvite?: () => void;
  onRoleChange?: (memberId: string, newRole: string) => void;
  onPenalty?: (memberId: string, type: string) => void;
  onRemove?: (memberId: string) => void;
  onStartElection?: () => void;
}

export function OrganizationManage({
  organization,
  members,
  onInvite,
  onRoleChange,
  onPenalty,
  onRemove,
  onStartElection,
}: OrganizationManageProps) {
  const getPenaltyBadge = (status: string | null | undefined) => {
    if (!status) return null;
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      warning: "secondary",
      yellow: "outline",
      red: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status === "warning" ? "警告" : status === "yellow" ? "イエローカード" : "レッドカード"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <h1 data-testid="page-title" className="text-2xl font-bold">
        メンバー管理
      </h1>
      <p className="text-muted-foreground">{organization.name}</p>

      {/* メンバー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>メンバー一覧</CardTitle>
          <CardDescription>組織に所属するメンバーを管理します</CardDescription>
          <div className="pt-2">
            <Input placeholder="メンバーを検索..." className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{member.role}</span>
                      <span>•</span>
                      <span>加入日: {member.joinedAt}</span>
                    </div>
                  </div>
                  {getPenaltyBadge(member.penaltyStatus)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRoleChange?.(member.id, "")}
                  >
                    役職変更
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPenalty?.(member.id, "warning")}
                  >
                    ペナルティ
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove?.(member.id)}
                  >
                    除名
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 招待・リクエスト */}
      <Card>
        <CardHeader>
          <CardTitle>招待・リクエスト</CardTitle>
          <CardDescription>新しいメンバーを招待したり、加入リクエストを処理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={onInvite}>メンバーを招待</Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">招待中</h4>
            <p className="text-sm text-muted-foreground">現在招待中のメンバーはいません</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">加入リクエスト</h4>
            <p className="text-sm text-muted-foreground">保留中のリクエストはありません</p>
          </div>
        </CardContent>
      </Card>

      {/* 選挙管理 */}
      <Card>
        <CardHeader>
          <CardTitle>選挙管理</CardTitle>
          <CardDescription>リーダー選出や不信任投票を管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={onStartElection}>選挙を開催</Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">現在の選挙</h4>
            <p className="text-sm text-muted-foreground">実施中の選挙はありません</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">選挙履歴</h4>
            <p className="text-sm text-muted-foreground">過去の選挙記録はありません</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
