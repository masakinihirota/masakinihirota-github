import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // allow test files named *.playwright.ts (this avoids Vitest picking them up)
  testMatch: /.*\.playwright\.ts/,
  timeout: 30 * 1000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
