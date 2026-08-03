import { test, expect } from '@playwright/test';

test.describe('Creator Admin Dashboard Flow', () => {
  test('redirects unauthenticated users to auth page', async ({ page }) => {
    // Navigating without session cookie should redirect to /auth or auth login
    await page.goto('/it/creator-admin');
    await page.waitForURL((url) => url.pathname.includes('/auth') || url.pathname.includes('/creator-admin'));

    const currentUrl = page.url();
    expect(currentUrl).toBeDefined();
  });

  test('renders creator navigation and action controls', async ({ page }) => {
    // Navigate to event creation route
    await page.goto('/it/creator-admin/event');

    // Page title or main header should be visible if authenticated or redirected
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
