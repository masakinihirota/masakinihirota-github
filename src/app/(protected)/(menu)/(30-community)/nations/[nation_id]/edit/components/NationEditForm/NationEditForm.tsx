"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Nation {
  id: string;
  name: string;
  slug: string;
  flagUrl?: string;
  themeColor: string;
  constitution: string;
}

interface NationEditFormProps {
  nation: Nation;
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
}

export function NationEditForm({ nation, onSubmit, onCancel }: NationEditFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle data-testid="card-title">国を編集</CardTitle>
        <CardDescription>
          国の公開情報を修正します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 警告 */}
          <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 国名の頻繁な変更は推奨されません。変更する場合は市民への周知をお願いします。
            </p>
          </div>

          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本情報</h3>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                国名 <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={nation.name}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="flag" className="text-sm font-medium">
                国旗
              </label>
              <Input
                id="flag"
                name="flag"
                type="file"
                accept="image/*"
              />
              {nation.flagUrl && (
                <p className="text-xs text-muted-foreground">
                  現在の国旗: {nation.flagUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="themeColor" className="text-sm font-medium">
                テーマカラー
              </label>
              <Input
                id="themeColor"
                name="themeColor"
                type="color"
                defaultValue={nation.themeColor}
                className="w-20 h-10"
              />
            </div>
          </div>

          {/* 憲法・理念 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">憲法・理念</h3>

            <div className="space-y-2">
              <label htmlFor="constitution" className="text-sm font-medium">
                憲法/理念 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="constitution"
                name="constitution"
                defaultValue={nation.constitution}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={5}
                required
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit">
              保存
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
