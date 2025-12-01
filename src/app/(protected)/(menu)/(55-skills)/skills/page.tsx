import { SkillList, Skill } from "./components/SkillList";

// モックデータ
const mockSkills: Skill[] = [
  {
    id: "1",
    name: "TypeScript",
    category: "プログラミング",
    description: "型安全なJavaScriptのスーパーセット。大規模アプリケーション開発に適している。",
    userCount: 156,
    officialUrl: "https://www.typescriptlang.org/",
  },
  {
    id: "2",
    name: "React",
    category: "プログラミング",
    description: "Facebookが開発したUIライブラリ。コンポーネントベースの開発が特徴。",
    userCount: 203,
    officialUrl: "https://react.dev/",
  },
  {
    id: "3",
    name: "Figma",
    category: "デザイン",
    description: "ブラウザベースのUIデザインツール。チーム協業に優れている。",
    userCount: 89,
    officialUrl: "https://www.figma.com/",
  },
  {
    id: "4",
    name: "英語",
    category: "言語",
    description: "国際コミュニケーションに必須の言語スキル。",
    userCount: 342,
  },
  {
    id: "5",
    name: "AWS認定",
    category: "資格",
    description: "Amazon Web Servicesの公式認定資格。",
    userCount: 67,
    officialUrl: "https://aws.amazon.com/certification/",
  },
  {
    id: "6",
    name: "Python",
    category: "プログラミング",
    description: "汎用性の高いプログラミング言語。データサイエンスやAI開発で人気。",
    userCount: 178,
    officialUrl: "https://www.python.org/",
  },
];

/**
 * スキル一覧ページ
 */
export default function SkillsPage() {
  return <SkillList skills={mockSkills} />;
}
