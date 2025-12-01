"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Citizen {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  contribution: number;
  stayDuration: string;
}

interface Nation {
  id: string;
  name: string;
}

interface NationManageProps {
  nation: Nation;
  citizens: Citizen[];
  onAppoint?: (citizenId: string, role: string) => void;
  onExpel?: (citizenId: string) => void;
  onScout?: () => void;
}

export function NationManage({
  nation,
  citizens,
  onAppoint,
  onExpel,
  onScout,
}: NationManageProps) {
  return (
    <div className="space-y-6">
      <h1 data-testid="page-title" className="text-2xl font-bold">
        国政管理
      </h1>
      <p className="text-muted-foreground">{nation.name}</p>

      {/* 市民一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>市民一覧</CardTitle>
          <CardDescription>国に所属する市民を管理します</CardDescription>
          <div className="pt-2">
            <Input placeholder="市民を検索..." className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {citizens.map((citizen) => (
              <div
                key={citizen.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={citizen.avatarUrl} alt={citizen.name} />
                    <AvatarFallback>{citizen.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{citizen.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{citizen.role}</Badge>
                      <span>•</span>
                      <span>貢献度: {citizen.contribution}pt</span>
                      <span>•</span>
                      <span>滞在: {citizen.stayDuration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAppoint?.(citizen.id, "")}
                  >
                    役職任命
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onExpel?.(citizen.id)}
                  >
                    追放
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 移住局 */}
      <Card>
        <CardHeader>
          <CardTitle>移住局</CardTitle>
          <CardDescription>移住申請の処理と市民のスカウトを行います</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={onScout}>スカウト</Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">移住申請リスト</h4>
            <p className="text-sm text-muted-foreground">保留中の申請はありません</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">スカウト中</h4>
            <p className="text-sm text-muted-foreground">送信中の勧誘はありません</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
