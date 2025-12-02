/**
 * ProfileList コンポーネント
 *
 * プロフィール一覧を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - プロフィール一覧の表示
 * - アバター、表示名、肩書き、所属の表示
 * - フォロー/詳細アクションの提供
 */

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Profile = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  role?: string;
  affiliation?: string;
  matchScore?: number;
};

type ProfileListProps = {
  profiles: Profile[];
};

export const ProfileList = ({ profiles }: ProfileListProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">プロフィール一覧</h1>

      {profiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>ユーザーが見つかりません</p>
          <p className="text-sm mt-2">検索条件を変更してください</p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id} role="listitem">
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                  <AvatarFallback>
                    {profile.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{profile.displayName}</span>
                    {profile.matchScore !== undefined && (
                      <Badge variant="secondary" className="shrink-0">
                        {profile.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {profile.role && <span>{profile.role}</span>}
                    {profile.role && profile.affiliation && <span>・</span>}
                    {profile.affiliation && <span>{profile.affiliation}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/profiles/${profile.id}`}>詳細</Link>
                  </Button>
                  <Button size="sm">フォロー</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
