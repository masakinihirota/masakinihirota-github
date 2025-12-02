import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/organization/createOrganization.service', () => ({
  createOrganization: vi.fn(async () => ({
    success: true,
    data: { id: 'org-123', name: 'テスト組織', description: '説明' },
  })),
}));

vi.mock('@/lib/organization/getOrganizations.service', () => ({
  getOrganizations: vi.fn(async () => ({
    success: true,
    data: [{ id: 'org-1', name: '組織1' }],
  })),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { POST, GET } from './route';
import { createClient } from '@/lib/supabase/server';

describe('POST /api/organizations', () => {
  beforeEach(() => vi.resetAllMocks());

  it('creates organization and returns success response', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const payload = { name: 'テスト組織', description: '説明' };
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data?.id).toBe('org-123');
  });
});

describe('GET /api/organizations', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns list of organizations', async () => {
    const req = new Request('http://localhost', { method: 'GET' });

    const res = await GET(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.length).toBeGreaterThan(0);
  });
});
