import { db } from "@/lib/db";
import {
  users,
  rootAccounts,
  profiles,
  organizations,
  organizationMembers,
  works,
  topdownNations,
  workCategories
} from "@/db/schema";
import { WorkCategory } from "@/db/constants";
import { faker } from "@faker-js/faker";

async function seedDummy() {
  console.log("🌱 Seeding Dummy Data...");

  const USERS_COUNT = 10;
  const WORKS_COUNT = 20;

  // 1. Users & Root Accounts
  console.log(`   - Creating ${USERS_COUNT} users...`);
  const createdUsers = [];

  for (let i = 0; i < USERS_COUNT; i++) {
    const userId = faker.string.uuid();
    const email = faker.internet.email();

    // Create User
    await db.insert(users).values({
      id: userId,
      email: email,
    }).onConflictDoNothing();

    // Create Root Account
    const [rootAccount] = await db.insert(rootAccounts).values({
      userId: userId,
      displayName: faker.person.fullName(),
      location: faker.location.country(),
    }).returning();

    createdUsers.push({ userId, rootAccount });
  }

  // 2. Profiles (1 per user for now)
  console.log("   - Creating Profiles...");
  const createdProfiles = [];
  for (const { rootAccount } of createdUsers) {
    const [profile] = await db.insert(profiles).values({
      rootAccountId: rootAccount.id,
      name: rootAccount.displayName, // Use same name for simplicity
      bio: faker.person.bio(),
    }).returning();
    createdProfiles.push(profile);
  }

  // 3. Organizations
  console.log("   - Creating Organizations...");
  const createdOrgs = [];
  for (const profile of createdProfiles) {
    // 50% chance to create an organization
    if (Math.random() > 0.5) {
      const [org] = await db.insert(organizations).values({
        name: `${profile.name}'s Org`,
        description: faker.company.catchPhrase(),
        leaderProfileId: profile.id,
      }).returning();

      // Add leader as member
      await db.insert(organizationMembers).values({
        organizationId: org.id,
        profileId: profile.id,
        roleId: 'org_leader', // Assuming 'org_leader' exists from master seed
      });

      createdOrgs.push(org);
    }
  }

  // 4. Works
  console.log(`   - Creating ${WORKS_COUNT} works...`);
  // Ensure categories exist (should be seeded by master)
  const categoryIds = Object.values(WorkCategory);

  for (let i = 0; i < WORKS_COUNT; i++) {
    await db.insert(works).values({
      title: faker.music.songName(),
      categoryId: faker.helpers.arrayElement(categoryIds),
      description: faker.lorem.sentence(),
      releaseYear: faker.date.past().getFullYear(),
      createdBy: createdUsers[0].rootAccount.id, // Assign to first user
      approved: true,
    });
  }

  // 5. Topdown Nations
  console.log("   - Creating Topdown Nations...");
  if (createdOrgs.length > 0 && createdProfiles.length > 0) {
    const founderOrg = createdOrgs[0];
    const founderProfile = createdProfiles.find(p => p.id === founderOrg.leaderProfileId);

    if (founderProfile) {
      await db.insert(topdownNations).values({
        name: "Neo Tokyo",
        description: "A futuristic nation.",
        founderProfileId: founderProfile.id,
        founderOrganizationId: founderOrg.id,
        scaleLevel: 1,
        status: 'active',
      }).onConflictDoNothing();
    }
  }

  console.log("✅ Dummy Data Seeding completed.");
  process.exit(0);
}

seedDummy().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
