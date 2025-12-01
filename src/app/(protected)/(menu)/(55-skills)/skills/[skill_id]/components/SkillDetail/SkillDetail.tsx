"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Plus,
  Users,
  ExternalLink,
  Code,
  Palette,
  Languages,
  Award
} from "lucide-react";

/** スキル保有ユーザーの型 */
export interface SkillUser {
  id: string;
  name: string;
  avatar?: string;
  level: "初級" | "中級" | "上級" | "エキスパート";
}

/** 関連作品の型 */
export interface RelatedWork {
  id: string;
  title: string;
  authorName: string;
}

/** スキル詳細の型 */
export interface SkillDetailData {
  id: string;
  name: string;
  category: string;
  description?: string;
  officialUrl?: string;
  userCount: number;
  users: SkillUser[];
  relatedWorks: RelatedWork[];
  relatedSkills: { id: string; name: string }[];
}

interface SkillDetailProps {
  skill: SkillDetailData;
  isAcquired?: boolean;
}

/** カテゴリに応じたアイコンを返す */
function getCategoryIcon(category: string) {
  switch (category) {
    case "プログラミング":
      return <Code className="h-5 w-5" />;
    case "デザイン":
      return <Palette className="h-5 w-5" />;
    case "言語":
      return <Languages className="h-5 w-5" />;
    case "資格":
      return <Award className="h-5 w-5" />;
    default:
      return <Award className="h-5 w-5" />;
  }
}

/** レベルに応じたバッジの色を返す */
function getLevelVariant(level: SkillUser["level"]): "default" | "secondary" | "destructive" | "outline" {
  switch (level) {
    case "エキスパート":
      return "destructive";
    case "上級":
      return "default";
    case "中級":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * スキル詳細コンポーネント
 * スキル情報、保有ユーザー、関連作品を表示
 */
export function SkillDetail({ skill, isAcquired = false }: SkillDetailProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 戻るリンク */}
      <Link
        href="/skills"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {getCategoryIcon(skill.category)}
            <h1 className="text-3xl font-bold">{skill.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{skill.category}</Badge>
            <span className="flex items-center text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {skill.userCount}人が保有
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {isAcquired ? (
            <Badge variant="default">習得済み</Badge>
          ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              習得する
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/skills/${skill.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* メインコンテンツ */}
        <div className="md:col-span-2 space-y-6">
          {/* 概要 */}
          <Card>
            <CardHeader>
              <CardTitle>概要</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {skill.description || "説明がありません"}
              </p>
              {skill.officialUrl && (
                <a
                  href={skill.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  公式サイト
                </a>
              )}
            </CardContent>
          </Card>

          {/* 保有ユーザー */}
          <Card>
            <CardHeader>
              <CardTitle>保有ユーザー</CardTitle>
            </CardHeader>
            <CardContent>
              {skill.users.length === 0 ? (
                <p className="text-muted-foreground">まだユーザーがいません</p>
              ) : (
                <div className="space-y-3">
                  {skill.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Badge variant={getLevelVariant(user.level)}>
                        {user.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 関連作品 */}
          <Card>
            <CardHeader>
              <CardTitle>関連作品</CardTitle>
            </CardHeader>
            <CardContent>
              {skill.relatedWorks.length === 0 ? (
                <p className="text-muted-foreground">関連する作品がありません</p>
              ) : (
                <div className="space-y-2">
                  {skill.relatedWorks.map((work) => (
                    <Link
                      key={work.id}
                      href={`/works/${work.id}`}
                      className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <p className="font-medium">{work.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {work.authorName}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 関連スキル */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">関連スキル</CardTitle>
            </CardHeader>
            <CardContent>
              {skill.relatedSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">関連スキルがありません</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skill.relatedSkills.map((relatedSkill) => (
                    <Link key={relatedSkill.id} href={`/skills/${relatedSkill.id}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        {relatedSkill.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
