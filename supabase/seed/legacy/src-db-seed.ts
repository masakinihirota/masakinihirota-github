// Archived application-local TypeScript seeder (src/db/seed.ts)

import { db } from "@/lib/db";
import { workCategories, valueCategories, works, valueDefinitions } from "@/db/schema";
import { workCategoriesData } from "./seeds/data/work-categories";
import { valueCategoriesData } from "./seeds/data/value-categories";
import { worksData } from "./seeds/data/works";
import { valuesData } from "./seeds/data/values";

async function main() {
  console.log("🌱 Starting seeding...");

  // Work Categories
  console.log("Inserting Work Categories...");
  await db.insert(workCategories).values(workCategoriesData).onConflictDoNothing();

  // Value Categories
  console.log("Inserting Value Categories...");
  await db.insert(valueCategories).values(valueCategoriesData).onConflictDoNothing();

  // Works
  console.log("Inserting Works...");
  // Works need to be inserted with categoryId reference.
  // The data already has categoryId matching the IDs in workCategoriesData.
  await db.insert(works).values(worksData).onConflictDoNothing();

  // Values
  console.log("Inserting Values...");
  await db.insert(valueDefinitions).values(valuesData).onConflictDoNothing();

  console.log("✅ Seeding completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
