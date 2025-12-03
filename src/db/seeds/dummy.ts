/**
 * ダミーデータシード（開発・テスト用）
 * ユーザー、プロフィール、組織、作品などのサンプルデータを生成
 */

import { db } from "@/lib/db";
import {
  users,
  rootAccounts,
  profiles,
  organizations,
  organizationMembers,
  works,
  topdownNations,
  profileWorks,
  rootAccountPoints,
  skills,
  profileSkills,
  lists,
  listItems,
  valueDefinitions,
  profileValues,
} from "@/db/schema";
import { WorkCategory, ValueCategory } from "@/db/constants";

export interface SeedDummyOptions {
  /** 生成するユーザー数 */
  usersCount?: number;
  /** 生成する作品数 */
  worksCount?: number;
  /** 生成するスキル数 */
  skillsCount?: number;
  /** 生成する価値観定義数 */
  valueDefinitionsCount?: number;
  /** ログを出力するか */
  verbose?: boolean;
}

export interface SeedDummyResult {
  usersCreated: number;
  profilesCreated: number;
  organizationsCreated: number;
  worksCreated: number;
  nationsCreated: number;
  skillsCreated: number;
  valueDefinitionsCreated: number;
  listsCreated: number;
}

/**
 * ダミーデータをシードする
 */
export async function seedDummyData(options: SeedDummyOptions = {}): Promise<SeedDummyResult> {
  const {
    usersCount = 10,
    worksCount = 20,
    skillsCount = 10,
    valueDefinitionsCount = 20,
    verbose = true,
  } = options;

  if (verbose) console.log("🌱 Seeding Dummy Data...");

  // 1. Generate UUIDs for users
  const userIds = Array.from({ length: usersCount }, () => crypto.randomUUID());

  // 2. Create Users
  if (verbose) console.log(`   - Creating ${usersCount} users...`);
  const userValues = userIds.map((id, i) => ({
    id,
    email: `test-user-${i + 1}@example.com`,
  }));
  await db.insert(users).values(userValues).onConflictDoNothing();

  // 3. Create Root Accounts
  if (verbose) console.log("   - Creating Root Accounts...");
  const rootAccountValues = userIds.map((userId, i) => ({
    id: crypto.randomUUID(),
    userId,
    displayName: `Test User ${i + 1}`,
    location: ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Okinawa"][i % 5],
  }));
  const insertedRootAccounts = await db.insert(rootAccounts).values(rootAccountValues).returning();

  // 4. Create Profiles
  if (verbose) console.log("   - Creating Profiles...");
  const profileRows = insertedRootAccounts.map((ra, i) => ({
    id: crypto.randomUUID(),
    rootAccountId: ra.id,
    name: `Profile ${i + 1}`,
    bio: `This is the bio for profile ${i + 1}`,
  }));
  const insertedProfiles = await db.insert(profiles).values(profileRows).returning();

  // 5. Initialize Points for Root Accounts
  if (verbose) console.log("   - Initializing Points...");
  const pointValues = insertedRootAccounts.map(ra => ({
    rootAccountId: ra.id,
    balance: 1000, // 初期ポイント
  }));
  await db.insert(rootAccountPoints).values(pointValues).onConflictDoNothing();

  // 6. Create Organizations (50% of profiles create an org)
  if (verbose) console.log("   - Creating Organizations...");
  const organizationValues = insertedProfiles
    .filter((_, i) => i % 2 === 0)
    .map((profile, i) => ({
      id: crypto.randomUUID(),
      name: `Organization ${i + 1}`,
      description: `Description for organization ${i + 1}`,
      leaderProfileId: profile.id,
    }));
  const insertedOrgs = await db.insert(organizations).values(organizationValues).returning();

  // 7. Add Organization Members
  if (verbose) console.log("   - Adding Organization Members...");
  const memberValues = insertedOrgs.map(org => ({
    organizationId: org.id,
    profileId: org.leaderProfileId!,
    roleId: 'org_leader',
  }));
  await db.insert(organizationMembers).values(memberValues).onConflictDoNothing();

  // 8. Create Skills
  if (verbose) console.log(`   - Creating ${skillsCount} Skills...`);
  const skillNames = [
    "TypeScript", "React", "Node.js", "Python", "Go",
    "Rust", "Design", "Project Management", "Communication", "Leadership"
  ];
  const skillValues = skillNames.slice(0, skillsCount).map((name, i) => ({
    id: crypto.randomUUID(),
    name,
    description: `Skill in ${name}`,
  }));
  const insertedSkills = await db.insert(skills).values(skillValues).returning();

  // 9. Assign Skills to Profiles
  if (verbose) console.log("   - Assigning Skills to Profiles...");
  const profileSkillValues = insertedProfiles.flatMap((profile, i) => {
    const numSkills = (i % 3) + 1;
    return insertedSkills.slice(0, numSkills).map((skill, j) => ({
      profileId: profile.id,
      skillId: skill.id,
      level: ((j % 5) + 1) as 1 | 2 | 3 | 4 | 5,
    }));
  });
  await db.insert(profileSkills).values(profileSkillValues).onConflictDoNothing();

  // 10. Create Value Definitions
  if (verbose) console.log(`   - Creating ${valueDefinitionsCount} Value Definitions...`);
  const valueContents = [
    "Honesty is the best policy",
    "Work hard, play hard",
    "Family first",
    "Gaming is life",
    "Continuous learning",
    "Teamwork makes the dream work",
    "Quality over quantity",
    "Innovation drives progress",
    "Respect for others",
    "Health is wealth",
    "Time is precious",
    "Creative expression",
    "Environmental awareness",
    "Financial independence",
    "Work-life balance",
    "Community contribution",
    "Personal growth",
    "Adventure and exploration",
    "Mindfulness and meditation",
    "Technology for good",
  ];
  const categoryIds = Object.values(ValueCategory);
  const valueDefValues = valueContents.slice(0, valueDefinitionsCount).map((content, i) => ({
    id: crypto.randomUUID(),
    content,
    categoryId: categoryIds[i % categoryIds.length],
  }));
  const insertedValueDefs = await db.insert(valueDefinitions).values(valueDefValues).returning();

  // 11. Assign Values to Profiles
  if (verbose) console.log("   - Assigning Values to Profiles...");
  const profileValueValues = insertedProfiles.flatMap((profile, i) => {
    const numValues = (i % 4) + 1;
    return insertedValueDefs.slice(0, numValues).map(valueDef => ({
      profileId: profile.id,
      valueId: valueDef.id,
    }));
  });
  await db.insert(profileValues).values(profileValueValues).onConflictDoNothing();

  // 12. Create Works
  if (verbose) console.log(`   - Creating ${worksCount} Works...`);
  const workTitles = [
    "The Great Adventure", "Mystic Quest", "Code Warriors",
    "Digital Dreams", "Pixel Paradise", "Melody of Stars",
    "Silent Symphony", "Epic Tales", "Cyber Nexus",
    "Shadow Realm", "Light Bringer", "Ocean Depths",
    "Mountain Peak", "Desert Storm", "Forest Mystery",
    "Urban Legend", "Space Odyssey", "Time Traveler",
    "Dragon's Lair", "Phoenix Rising"
  ];
  const categoryIds2 = Object.values(WorkCategory);
  const workValues = workTitles.slice(0, worksCount).map((title, i) => ({
    id: crypto.randomUUID(),
    title,
    categoryId: categoryIds2[i % categoryIds2.length],
    description: `Description for ${title}`,
    releaseYear: 2020 + (i % 5),
    createdBy: insertedRootAccounts[0].id,
    approved: true,
  }));
  const insertedWorks = await db.insert(works).values(workValues).returning();

  // 13. Add Works to Profiles
  if (verbose) console.log("   - Adding Works to Profiles...");
  const profileWorkValues = insertedProfiles.flatMap((profile, i) => {
    const numWorks = (i % 3) + 2;
    return insertedWorks.slice(0, numWorks).map((work, j) => ({
      profileId: profile.id,
      workId: work.id,
      status: ['now', 'life', 'future'][j % 3],
      tier: ((j % 3) + 1) as 1 | 2 | 3,
      claps: j * 5,
      liked: j % 2 === 0,
    }));
  });
  await db.insert(profileWorks).values(profileWorkValues).onConflictDoNothing();

  // 14. Create Lists
  if (verbose) console.log("   - Creating Lists...");
  const listValues = insertedProfiles.slice(0, 5).map((profile, i) => ({
    id: crypto.randomUUID(),
    title: `My List ${i + 1}`,
    description: `A custom list for profile ${i + 1}`,
    ownerId: profile.id,
    visibility: i % 2 === 0 ? 'public' : 'private',
    listType: ['favorites', 'oshi', 'reading', 'todo', 'custom'][i % 5],
  }));
  const insertedLists = await db.insert(lists).values(listValues).returning();

  // 15. Add Items to Lists
  if (verbose) console.log("   - Adding Items to Lists...");
  const listItemValues = insertedLists.flatMap((list, i) => {
    const numItems = 3;
    return insertedWorks.slice(0, numItems).map((work, j) => ({
      id: crypto.randomUUID(),
      listId: list.id,
      itemType: 'work',
      itemId: work.id,
      position: j,
    }));
  });
  await db.insert(listItems).values(listItemValues).onConflictDoNothing();

  // 16. Create Topdown Nations
  if (verbose) console.log("   - Creating Topdown Nations...");
  let nationsCreated = 0;
  if (insertedOrgs.length > 0 && insertedProfiles.length > 0) {
    const founderOrg = insertedOrgs[0];
    const founderProfile = insertedProfiles.find(p => p.id === founderOrg.leaderProfileId);

    if (founderProfile) {
      await db.insert(topdownNations).values({
        name: "Neo Tokyo",
        description: "A futuristic nation focused on technology and innovation.",
        founderProfileId: founderProfile.id,
        founderOrganizationId: founderOrg.id,
        scaleLevel: 1,
        status: 'active',
      }).onConflictDoNothing();
      nationsCreated = 1;
    }
  }

  if (verbose) console.log("✅ Dummy Data Seeding completed.");

  return {
    usersCreated: userValues.length,
    profilesCreated: profileRows.length,
    organizationsCreated: organizationValues.length,
    worksCreated: workValues.length,
    nationsCreated,
    skillsCreated: skillValues.length,
    valueDefinitionsCreated: valueDefValues.length,
    listsCreated: listValues.length,
  };
}
