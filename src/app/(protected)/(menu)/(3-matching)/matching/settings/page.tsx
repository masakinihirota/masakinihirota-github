import { MatchingSettings } from "./components";

export const metadata = { title: "マッチング設定 — masakinihirota" };

// モックデータ（後でAPIから取得）
const mockSettings = {
  values: [
    { id: "value-1", name: "創造性", importance: 80 },
    { id: "value-2", name: "誠実さ", importance: 70 },
    { id: "value-3", name: "協調性", importance: 60 },
    { id: "value-4", name: "挑戦心", importance: 90 },
  ],
  genres: [
    { id: "genre-1", name: "フィクション", selected: true },
    { id: "genre-2", name: "ファンタジー", selected: true },
    { id: "genre-3", name: "SF", selected: false },
    { id: "genre-4", name: "ノンフィクション", selected: true },
    { id: "genre-5", name: "ミステリー", selected: false },
  ],
  skills: [
    { id: "skill-1", name: "プログラミング", selected: true },
    { id: "skill-2", name: "デザイン", selected: false },
    { id: "skill-3", name: "ライティング", selected: true },
    { id: "skill-4", name: "マーケティング", selected: false },
  ],
  region: "日本",
  generation: "1990年代",
};

export default function MatchingSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <MatchingSettings settings={mockSettings} />
    </div>
  );
}
