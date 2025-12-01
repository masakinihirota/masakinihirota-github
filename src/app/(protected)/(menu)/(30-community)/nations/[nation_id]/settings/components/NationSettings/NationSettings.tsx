"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Nation {
  id: string;
  name: string;
  taxRate: number;
  immigrationPolicy: string;
}

interface NationSettingsProps {
  nation: Nation;
  onSave?: (data: FormData) => void;
  onDestroy?: () => void;
}

export function NationSettings({ nation, onSave, onDestroy }: NationSettingsProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      const formData = new FormData(e.currentTarget);
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      <h1 data-testid="page-title" className="text-2xl font-bold">
        国設定
      </h1>

      {/* 制度設定 */}
      <Card>
        <CardHeader>
          <CardTitle>制度設定</CardTitle>
          <CardDescription>国の運営に関わる重要なパラメータを設定します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="taxRate" className="text-sm font-medium">
                税率
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={nation.taxRate}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                ポイント還元の配分率を設定します
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="immigrationPolicy" className="text-sm font-medium">
                移住制限
              </label>
              <select
                id="immigrationPolicy"
                name="immigrationPolicy"
                defaultValue={nation.immigrationPolicy}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="open">誰でも移住可能</option>
                <option value="approval">承認制</option>
                <option value="closed">鎖国（移住不可）</option>
              </select>
            </div>

            <Button type="submit">設定を保存</Button>
          </form>
        </CardContent>
      </Card>

      {/* 危険な設定 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">危険な設定</CardTitle>
          <CardDescription>この操作は元に戻すことができません</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-destructive/10">
            <h4 className="font-medium text-destructive mb-2">国の滅亡（解散）</h4>
            <p className="text-sm text-muted-foreground mb-4">
              国を滅亡させると、全てのデータが削除され、市民は全員追放されます。
              この操作は元に戻すことができません。
            </p>
            <Button variant="destructive" onClick={onDestroy}>
              国を滅亡させる
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
