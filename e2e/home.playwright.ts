import { test, expect } from '@playwright/test';

test('sidebar links load without 404', async ({ page }) => {
  await page.goto('/home');
  await expect(page.locator('text=masakinihirota')).toBeVisible();

  // sanity checks for main pages
  await page.click('nav >> text=マッチング');
  await expect(page).toHaveURL(/\/matching/);

  await page.goto('/home');
  await page.click('nav >> text=検索');
  await expect(page).toHaveURL(/\/search/);
});
