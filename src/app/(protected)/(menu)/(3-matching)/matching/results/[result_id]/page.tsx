import { MatchingResultDetail } from "./components";

export const metadata = { title: "マッチング詳細 — masakinihirota" };

// モックデータ（後でAPIから取得）
const mockResult = {
  id: "result-1",
  candidateName: "田中太郎",
  candidateAvatar: undefined,
  candidateBio: "Web開発者です。趣味は読書と映画鑑賞。新しい技術を学ぶことが好きです。",
  compatibilityScore: 85,
  analysisCategories: [
    { name: "価値観", score: 90 },
    { name: "趣味", score: 80 },
    { name: "ライフスタイル", score: 75 },
    { name: "コミュニケーション", score: 85 },
  ],
  commonPoints: ["価値観が似ている", "同じ趣味", "好きな映画が同じ", "読書好き"],
  aiComment: "二人は価値観において非常に相性が良いです。特に、創造性を大切にする点や、自己成長を重視する姿勢が共通しています。コミュニケーションのスタイルも似ており、建設的な対話ができるでしょう。",
  suggestedTopics: ["好きな映画について", "休日の過ごし方", "最近読んだ本", "仕事のやりがい"],
  matchedAt: "2025-12-01",
};

type PageProps = {
  params: Promise<{ result_id: string }>;
};

export default async function MatchingResultDetailPage({ params }: PageProps) {
  const { result_id } = await params;

  // 実際にはAPIからデータを取得
  const result = { ...mockResult, id: result_id };

  return (
    <div className="container mx-auto py-8">
      <MatchingResultDetail result={result} />
    </div>
  );
}
