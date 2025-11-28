// Global test setup for Vitest
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
// matchers should be an object of functions; guard in case import fails
if (matchers && typeof matchers === 'object') {
	expect.extend(matchers as any);
}

// You can add other global test setup here later (e.g., fetch polyfills)
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});

// Helpful note for contributors: centralized test helpers
// - We provide a shared DB mock helper at `src/tests/setup/mockDb.ts`.
// - To use it in a test which imports `@/lib/db`, call `setupDbMock(...)`
//   before importing the module under test so the module doesn't open a real DB connection.
// Example pattern:
//   import { setupDbMock } from '@/tests/setup'
//   setupDbMock({ select: () => ({ from: vi.fn().mockResolvedValue([]) }) })
//   import { myModule } from '@/actions/myModule'

