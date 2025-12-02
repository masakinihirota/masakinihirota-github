import { WorkList } from "./components/WorkList";

export const metadata = { title: '作品一覧 — masakinihirota' };

const mockWorks = [
  {
    id: "1",
    title: "鬼滅の刃",
    author: "吾峠呼世晴",
    category: "漫画",
    year: "2016",
  },
  {
    id: "2",
    title: "進撃の巨人",
    author: "諫山創",
    category: "漫画",
    year: "2009",
  },
  {
    id: "3",
    title: "君の名は。",
    author: "新海誠",
    category: "映画",
    year: "2016",
  },
];

export default function WorksPage() {
    return (
        <div className="container py-6">
            <WorkList works={mockWorks} />
        </div>
    );
}
