import * as matchingComponents from "./components";

export const metadata = { title: "マッチング — masakinihirota" };

// モックデータ（後でAPI/DBから取得する）
const mockStatus: matchingComponents.MatchingStatus = {
  ticketCount: 5,
  lastMatchDate: "2025-11-30",
  hasProfile: true,
};

export default function MatchingPage() {
  return (
    <div className="container mx-auto py-6">
      <matchingComponents.MatchingTop status={mockStatus} />
    </div>
  );
}
