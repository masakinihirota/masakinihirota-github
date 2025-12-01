"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Code, Palette, Languages, Award } from "lucide-react";

/** スキルのデータ型 */
export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  userCount: number;
  officialUrl?: string;
}

interface SkillListProps {
  skills: Skill[];
}

/** カテゴリに応じたアイコンを返す */
function getCategoryIcon(category: string) {
  switch (category) {
    case "プログラミング":
      return <Code className="h-4 w-4" />;
    case "デザイン":
      return <Palette className="h-4 w-4" />;
    case "言語":
      return <Languages className="h-4 w-4" />;
    case "資格":
      return <Award className="h-4 w-4" />;
    default:
      return <Award className="h-4 w-4" />;
  }
}

/** カテゴリに応じたバッジのバリアントを返す */
function getCategoryVariant(category: string): "default" | "secondary" | "destructive" | "outline" {
  switch (category) {
    case "プログラミング":
      return "default";
    case "デザイン":
      return "secondary";
    case "言語":
      return "outline";
    default:
      return "default";
  }
}

/**
 * スキル一覧コンポーネント
 * スキルをカード形式で表示し、新規登録へのリンクも提供
 */
export function SkillList({ skills }: SkillListProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">スキル一覧</h1>
        <Button asChild>
          <Link href="/skills/new">
            <Plus className="mr-2 h-4 w-4" />
            スキル登録
          </Link>
        </Button>
      </div>

      {/* スキルリスト */}
      {skills.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              登録されているスキルがありません
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Link key={skill.id} href={`/skills/${skill.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge variant={getCategoryVariant(skill.category)}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(skill.category)}
                        {skill.category}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {skill.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {skill.description}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{skill.userCount}人が保有</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
