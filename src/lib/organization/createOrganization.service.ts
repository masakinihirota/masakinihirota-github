/**
 * Organization creation service
 * Handles database operations for creating organizations
 */
import { db } from '@/lib/db';
import { organizations } from '@/db/schema';

export interface CreateOrganizationData {
  name: string;
  description?: string;
  leaderProfileId?: string;
}

export interface CreateOrganizationResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description?: string | null;
  };
  error?: string;
}

/**
 * Creates a new organization in the database
 * @param data - The organization creation data
 * @returns CreateOrganizationResult with success flag and created data
 */
export async function createOrganization(
  data: CreateOrganizationData
): Promise<CreateOrganizationResult> {
  try {
    const [inserted] = await db
      .insert(organizations)
      .values({
        name: data.name,
        description: data.description ?? null,
        leaderProfileId: data.leaderProfileId ?? null,
      })
      .returning({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
      });

    return {
      success: true,
      data: inserted,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
