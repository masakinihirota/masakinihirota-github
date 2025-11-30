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
import { afterEach, beforeEach } from 'vitest';
import { runAndResetCleanups, resetCleanupRegistry, registerCleanup } from './src/tests/setup/cleanup';
import { db } from './src/lib/db';

beforeEach(() => {
	// ensure registry is clean before each test
	resetCleanupRegistry();
});

afterEach(async () => {
	// Any registered cleanup functions (db deletes, etc.) are executed here
	await runAndResetCleanups();
	cleanup();
});

// Start a DB transaction before each test and schedule a rollback as the last cleanup.
beforeEach(async () => {
	try {
		await db.execute('BEGIN');
		// Register rollback so it runs after other cleanups (LIFO ensures it runs last)
		registerCleanup(async () => {
			try {
				await db.execute('ROLLBACK');
			} catch (e) {
				// ignore rollback errors but log
				// eslint-disable-next-line no-console
				console.warn('rollback failed', e?.message ?? e);
			}
		});
	} catch (e) {
		// If DB is not available, skip transaction isolation
		// eslint-disable-next-line no-console
		console.warn('DB transaction begin failed (tests may not be isolated):', e?.message ?? e);
	}
});

// Helpful note for contributors: centralized test helpers
// - We provide a shared DB mock helper at `src/tests/setup/mockDb.ts`.
// - To use it in a test which imports `@/lib/db`, call `setupDbMock(...)`
//   before importing the module under test so the module doesn't open a real DB connection.
// Example pattern:
//   import { setupDbMock } from '@/tests/setup'
//   setupDbMock({ select: () => ({ from: vi.fn().mockResolvedValue([]) }) })
//   import { myModule } from '@/actions/myModule'

