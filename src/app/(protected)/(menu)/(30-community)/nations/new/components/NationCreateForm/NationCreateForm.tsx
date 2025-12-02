"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NationCreateFormProps {
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
}

export function NationCreateForm({ onSubmit, onCancel }: NationCreateFormProps) {
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
        <CardTitle data-testid="card-title">国を建国する</CardTitle>
        <CardDescription>
          あなたの領土を確保し、同志を募る国を設立します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="例: Neo Japan"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nationId" className="text-sm font-medium">
                国ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="nationId"
                name="nationId"
                placeholder="例: neo-japan（URLに使用されます）"
                pattern="[a-z0-9-]+"
                required
              />
              <p className="text-xs text-muted-foreground">
                半角英数字とハイフンのみ使用可能
              </p>
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
            </div>

            <div className="space-y-2">
              <label htmlFor="themeColor" className="text-sm font-medium">
                テーマカラー
              </label>
              <Input
                id="themeColor"
                name="themeColor"
                type="color"
                defaultValue="#3B82F6"
                className="w-20 h-10"
              />
              <p className="text-xs text-muted-foreground">
                地図上の領土色として使用されます
              </p>
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
                placeholder="国の方向性や価値観を記述してください（例: 全てのクリエイターを歓迎する国です）"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                これがマッチングや入国の判断基準となります
              </p>
            </div>
          </div>

          {/* 建国コスト */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">建国費用</p>
                <p className="text-sm text-muted-foreground">
                  建国には以下のポイントが必要です
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                1,000pt
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit">
              建国する
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
