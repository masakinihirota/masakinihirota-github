import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "@/lib/db";
import { workCategories, valueCategories, works, valueDefinitions } from "@/db/schema";
import { ValueCategory } from "@/db/constants";

async function main() {
  console.log("Seeding started...");

  // 1. Work Categories
  console.log("Seeding Work Categories...");
  await db.insert(workCategories).values([
    { id: "novel", name: "小説" },
    { id: "manga", name: "漫画" },
    { id: "anime", name: "アニメ" },
    { id: "movie", name: "映画" },
    { id: "game", name: "ゲーム" },
    { id: "music", name: "音楽" },
    { id: "other", name: "その他" },
  ]).onConflictDoNothing();

  // 2. Value Categories (Questions)
  console.log("Seeding Value Categories...");
  await db.insert(valueCategories).values([
    { id: ValueCategory.Life, name: "人生観", question: "人生で最も大切にしているものは？", description: "人生における優先順位" },
    { id: ValueCategory.Work, name: "仕事観", question: "仕事選びで重視することは？", description: "仕事に対する価値観" },
    { id: ValueCategory.Love, name: "恋愛観", question: "パートナーに求めるものは？", description: "恋愛・パートナーシップ" },
    { id: ValueCategory.Hobby, name: "趣味", question: "休日の過ごし方は？", description: "プライベートの過ごし方" },
  ]).onConflictDoNothing();

  // 3. Value Definitions (Options)
  console.log("Seeding Value Definitions...");
  // 既存データを削除（開発環境用）
  await db.delete(valueDefinitions);

  await db.insert(valueDefinitions).values([
    // 人生観
    { content: "家族", categoryId: ValueCategory.Life },
    { content: "お金", categoryId: ValueCategory.Life },
    { content: "自由", categoryId: ValueCategory.Life },
    { content: "挑戦", categoryId: ValueCategory.Life },
    { content: "安定", categoryId: ValueCategory.Life },
    // 仕事観
    { content: "給与", categoryId: ValueCategory.Work },
    { content: "やりがい", categoryId: ValueCategory.Work },
    { content: "人間関係", categoryId: ValueCategory.Work },
    { content: "成長", categoryId: ValueCategory.Work },
    { content: "ワークライフバランス", categoryId: ValueCategory.Work },
    // 恋愛観
    { content: "誠実さ", categoryId: ValueCategory.Love },
    { content: "ユーモア", categoryId: ValueCategory.Love },
    { content: "経済力", categoryId: ValueCategory.Love },
    { content: "外見", categoryId: ValueCategory.Love },
    { content: "価値観の一致", categoryId: ValueCategory.Love },
    // 趣味
    { content: "インドア", categoryId: ValueCategory.Hobby },
    { content: "アウトドア", categoryId: ValueCategory.Hobby },
    { content: "創作活動", categoryId: ValueCategory.Hobby },
    { content: "スポーツ", categoryId: ValueCategory.Hobby },
    { content: "旅行", categoryId: ValueCategory.Hobby },
  ]);

  // 4. Works (Initial Data)
  console.log("Seeding Works...");
  await db.delete(works);

  await db.insert(works).values([
    {
      title: "走れメロス",
      categoryId: "novel",
      authors: ["太宰治"],
      releaseYear: 1940,
      size: "短編",
      approved: true
    },
    {
      title: "銀河鉄道の夜",
      categoryId: "novel",
      authors: ["宮沢賢治"],
      releaseYear: 1934,
      size: "中編",
      approved: true
    },
    {
      title: "桃太郎",
      categoryId: "other",
      authors: ["不明"],
      size: "ショート",
      approved: true
    },
  ]);

  console.log("Seeding completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
