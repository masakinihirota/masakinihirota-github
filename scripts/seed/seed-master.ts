import { db } from "@/lib/db";
import {
  workCategories,
  valueCategories,
  nationLevels,
  valueDefinitions,
  skills
} from "@/db/schema";
import {
  WorkCategory,
  ValueCategory,
  NationLevel
} from "@/db/constants";
import { seedRBAC } from "@/db/seeds/rbac";

async function seedMaster() {
  console.log("🌱 Seeding Master Data...");

  // 1. Work Categories
  console.log("   - Seeding Work Categories...");
  await db.insert(workCategories).values(
    Object.values(WorkCategory).map(c => ({ id: c, name: c }))
  ).onConflictDoNothing();

  // 2. Value Categories
  console.log("   - Seeding Value Categories...");
  await db.insert(valueCategories).values(
    Object.values(ValueCategory).map(c => ({
      id: c,
      name: c,
      description: `Category for ${c} values`
    }))
  ).onConflictDoNothing();

  // 3. Nation Levels
  console.log("   - Seeding Nation Levels...");
  await db.insert(nationLevels).values(
    Object.values(NationLevel).map(l => ({ id: l, name: l }))
  ).onConflictDoNothing();

  // 4. RBAC
  await seedRBAC();

  // 5. Initial Value Definitions (Sample)
  console.log("   - Seeding Sample Value Definitions...");
  const sampleValues = [
    { content: "Honesty is the best policy", categoryId: ValueCategory.Life },
    { content: "Work hard, play hard", categoryId: ValueCategory.Work },
    { content: "Family first", categoryId: ValueCategory.Love },
    { content: "Gaming is life", categoryId: ValueCategory.Hobby },
  ];

  // Note: valueDefinitions has defaultRandom() for ID, so we don't need to provide it if we don't want to fix it.
  // But for idempotency in a real seed, we might want fixed IDs or check existence.
  // For now, we'll just insert. In a real scenario, we might want to clear or upsert.
  // Since this is "seed-master", let's assume it runs on fresh DB or handles conflicts.
  // valueDefinitions doesn't have a unique constraint on content, so this might duplicate if run multiple times.
  // Let's skip for now or make it safe.

  // For safety, let's just log it.
  // await db.insert(valueDefinitions).values(sampleValues);

  console.log("✅ Master Data Seeding completed.");
  process.exit(0);
}

seedMaster().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
