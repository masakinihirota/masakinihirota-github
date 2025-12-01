/**
 * Organization list service
 * Handles database operations for retrieving organizations
 */
import { db } from '@/lib/db';
import { organizations } from '@/db/schema';

export interface OrganizationListItem {
  id: string;
  name: string;
  description?: string | null;
}

export interface GetOrganizationsResult {
  success: boolean;
  data?: OrganizationListItem[];
  error?: string;
}

/**
 * Retrieves all organizations from the database
 * @returns GetOrganizationsResult with success flag and data
 */
export async function getOrganizations(): Promise<GetOrganizationsResult> {
  try {
    const rows = await db.select({
      id: organizations.id,
      name: organizations.name,
      description: organizations.description,
    }).from(organizations);

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
