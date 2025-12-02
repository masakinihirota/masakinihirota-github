"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

/** スキルカテゴリ */
const SKILL_CATEGORIES = [
  "プログラミング",
  "デザイン",
  "言語",
  "資格",
  "その他",
] as const;

/**
 * スキル作成フォームコンポーネント
 */
export function SkillCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 実際にはここでAPIを呼び出してスキルを作成
      // await createSkill({ name, category, description, officialUrl });
      console.log("Creating skill:", { name, category, description, officialUrl });

      // 成功したらスキル一覧に戻る
      router.push("/skills");
    } catch (error) {
      console.error("Failed to create skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-2xl">
      {/* 戻るリンク */}
      <Link
        href="/skills"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        一覧に戻る
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>スキル登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">基本情報</h3>

              {/* スキル名 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  スキル名 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="例: TypeScript, Photoshop, 英語"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* カテゴリ */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  カテゴリ <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 説明 */}
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  placeholder="スキルの概要を入力してください"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">詳細情報</h3>

              {/* 公式サイトURL */}
              <div className="space-y-2">
                <Label htmlFor="officialUrl">公式サイトURL</Label>
                <Input
                  id="officialUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                />
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting || !name || !category}>
                {isSubmitting ? "登録中..." : "登録"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/skills">キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
