/**
 * ProfileDetail コンポーネント
 *
 * プロフィール詳細情報を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - プロフィール情報（名前、Bio、目的、役割、種類）の表示
 * - 登録作品セクションの表示
 * - 価値観セクションの表示
 * - スキルセクションの表示
 * - 所属組織セクションの表示
 * - 編集/フォローボタンの提供
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ProfileDetailData = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  purpose?: string; // 仕事、遊び、婚活など
  role?: string; // リーダー or メンバー
  type?: string; // 本人（匿名）、本人（実名）、本人（認証済み実名）、インタビュー、他人視点
  isOwner: boolean; // 自分のプロフィールかどうか
  works?: Work[];
  values?: Value[];
  skills?: Skill[];
  organizations?: Organization[];
};

type Work = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  tier: number;
  status: string;
  claps: number;
};

type Value = {
  id: string;
  question: string;
  answer: string;
};

type Skill = {
  id: string;
  name: string;
  level: number; // 0-5
  percentage: number; // 0-100
};

type Organization = {
  id: string;
  name: string;
  iconUrl?: string;
  role: string;
};

type ProfileDetailProps = {
  profile: ProfileDetailData;
};

export const ProfileDetail = ({ profile }: ProfileDetailProps) => {
  return (
    <div className="space-y-8">
      {/* プロフィール情報カード */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback className="text-2xl">
                {profile.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                {profile.bio && (
                  <p className="text-muted-foreground mt-2">{profile.bio}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.purpose && (
                  <Badge variant="outline">目的: {profile.purpose}</Badge>
                )}
                {profile.role && (
                  <Badge variant="outline">役割: {profile.role}</Badge>
                )}
                {profile.type && (
                  <Badge variant="secondary">種類: {profile.type}</Badge>
                )}
              </div>

              <div className="flex gap-2">
                {profile.isOwner ? (
                  <Button asChild>
                    <Link href={`/profiles/${profile.id}/edit`}>編集</Link>
                  </Button>
                ) : (
                  <Button>フォロー</Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 登録作品セクション */}
      {profile.works && profile.works.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>登録作品</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.works.slice(0, 3).map((work) => (
                  <Link
                    key={work.id}
                    href={`/works/${work.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-4">
                        <div className="aspect-video bg-muted rounded mb-2" />
                        <h3 className="font-medium truncate">{work.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs">
                            Tier {work.tier}
                          </Badge>
                          <span>状態: {work.status}</span>
                        </div>
                        <div className="text-sm mt-1">👏 {work.claps}拍手</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {profile.works.length > 3 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/works?profile=${profile.id}`}
                    className="text-primary hover:underline"
                  >
                    もっと見る →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* 価値観セクション */}
      {profile.values && profile.values.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>価値観</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profile.values.slice(0, 5).map((value) => (
                  <li key={value.id} className="text-sm">
                    <span className="font-medium">{value.question}:</span>{" "}
                    {value.answer}
                  </li>
                ))}
              </ul>
              {profile.values.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/values?profile=${profile.id}`}
                    className="text-primary hover:underline"
                  >
                    もっと見る →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* スキルセクション */}
      {profile.skills && profile.skills.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>スキル</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {profile.skills.slice(0, 5).map((skill) => (
                  <li key={skill.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Lv.{skill.level}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {profile.skills.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/skills?profile=${profile.id}`}
                    className="text-primary hover:underline"
                  >
                    もっと見る →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* 所属組織セクション */}
      {profile.organizations && profile.organizations.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>所属組織</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.organizations.slice(0, 4).map((org) => (
                  <Link
                    key={org.id}
                    href={`/organizations/${org.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="flex items-center gap-3 py-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={org.iconUrl} alt={org.name} />
                          <AvatarFallback>
                            {org.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{org.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            役割: {org.role}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {profile.organizations.length > 4 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/organizations?profile=${profile.id}`}
                    className="text-primary hover:underline"
                  >
                    もっと見る →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};
