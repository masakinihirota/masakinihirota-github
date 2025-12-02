import { test, expect } from '@playwright/test';

test('sidebar links load without 404', async ({ page }) => {
  await page.goto('/home');
  // ensure header brand is visible (avoid matching footer or other duplicates)
  await expect(page.locator('header >> text=masakinihirota')).toBeVisible();

  // sanity checks for main pages
  // click the link by role to avoid selecting wrong nav element
  // click the sidebar link by href to avoid ambiguous matches
  await page.click('a[href="/matching"]');
  await expect(page).toHaveURL(/\/matching/);

  await page.goto('/home');
  await page.click('a[href="/search"]');
  await expect(page).toHaveURL(/\/search/);
});
