// Global test setup for Vitest
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
// matchers should be an object of functions; guard in case import fails
if (matchers && typeof matchers === 'object') {
	expect.extend(matchers as any);
}

// You can add other global test setup here later (e.g., fetch polyfills)
