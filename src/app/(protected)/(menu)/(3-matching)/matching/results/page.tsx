import { MatchingResults } from "./components";

export const metadata = { title: "マッチング結果 — masakinihirota" };

// モックデータ（後でAPIから取得）
const mockResults = [
  {
    id: "result-1",
    candidateName: "田中太郎",
    candidateAvatar: undefined,
    compatibilityScore: 85,
    commonPoints: ["価値観が似ている", "同じ趣味"],
    matchedAt: "2025-12-01",
  },
  {
    id: "result-2",
    candidateName: "山田花子",
    candidateAvatar: undefined,
    compatibilityScore: 72,
    commonPoints: ["好きな映画が同じ"],
    matchedAt: "2025-12-01",
  },
];

export default function MatchingResultsPage() {
  return (
    <div className="container mx-auto py-8">
      <MatchingResults results={mockResults} />
    </div>
  );
}
