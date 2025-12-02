/**
 * MatchingSettings コンポーネント
 *
 * マッチング設定画面を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - 価値観の重要度設定
 * - 作品ジャンルの優先度設定
 * - スキルの絞り込み設定
 * - その他の設定（地域、世代）
 * - 保存ボタンとマッチング開始ボタン
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export type ValueSetting = {
  id: string;
  name: string;
  importance: number;
};

export type GenreSetting = {
  id: string;
  name: string;
  selected: boolean;
};

export type SkillSetting = {
  id: string;
  name: string;
  selected: boolean;
};

export type MatchingSettingsData = {
  values: ValueSetting[];
  genres: GenreSetting[];
  skills: SkillSetting[];
  region: string;
  generation: string;
};

type MatchingSettingsProps = {
  settings: MatchingSettingsData;
};

export const MatchingSettings = ({ settings }: MatchingSettingsProps) => {
  return (
    <div className="space-y-8">
      {/* ナビゲーション */}
      <div>
        <Link
          href="/matching"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← マッチングに戻る
        </Link>
      </div>

      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold">マッチング設定</h1>
        <p className="text-muted-foreground mt-1">
          マッチング条件を設定して、より精度の高い結果を得ましょう
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 価値観の重要度 */}
        <Card>
          <CardHeader>
            <CardTitle>📊 価値観の重要度</CardTitle>
            <CardDescription>各価値観の重要度を設定してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.values.map((value) => (
              <div key={value.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{value.name}</span>
                  <span className="font-medium">{value.importance}%</span>
                </div>
                <Progress value={value.importance} />
              </div>
            ))}
            {settings.values.length === 0 && (
              <p className="text-sm text-muted-foreground">
                価値観が登録されていません
              </p>
            )}
          </CardContent>
        </Card>

        {/* 作品ジャンルの優先度 */}
        <Card>
          <CardHeader>
            <CardTitle>📚 作品ジャンルの優先度</CardTitle>
            <CardDescription>興味のあるジャンルを選択してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings.genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={genre.id}
                  defaultChecked={genre.selected}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor={genre.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {genre.name}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* スキルの絞り込み */}
        <Card>
          <CardHeader>
            <CardTitle>🛠️ スキルの絞り込み</CardTitle>
            <CardDescription>マッチングしたいスキルを選択してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings.skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={skill.id}
                  defaultChecked={skill.selected}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor={skill.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {skill.name}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* その他の設定 */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ その他の設定</CardTitle>
            <CardDescription>追加のフィルタ条件を設定してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">地域</label>
              <p className="text-sm text-muted-foreground mt-1">{settings.region}</p>
            </div>
            <div>
              <label className="text-sm font-medium">世代</label>
              <p className="text-sm text-muted-foreground mt-1">{settings.generation}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* アクションボタン */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              設定を保存する
            </Button>
            <Button size="lg" className="min-w-[200px]" asChild>
              <Link href="/matching/results">
                マッチング開始 🚀
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
