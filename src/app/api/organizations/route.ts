import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrganization } from '@/lib/organization/createOrganization.service';
import { getOrganizations } from '@/lib/organization/getOrganizations.service';

/**
 * POST /api/organizations
 * Creates a new organization
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: '組織名は必須です' },
        { status: 400 }
      );
    }

    // Create organization
    const result = await createOrganization({ name, description });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/organizations
 * Returns list of all organizations
 */
export async function GET(_request: Request) {
  try {
    const result = await getOrganizations();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
