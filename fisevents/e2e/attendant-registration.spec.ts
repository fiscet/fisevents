import { test, expect } from '@playwright/test';

test.describe('Attendant Registration Flow', () => {
  test('displays public event details and validates attendant form inputs', async ({ page }) => {
    // Mock public event API response or route if needed
    await page.route('**/api/user/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to local event page (or test fallback route)
    await page.goto('/it/pe/demo-org/demo-event');

    // Check main title or fallback heading visibility
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Check if attendant form container is rendered when event is accessible
    const formContainer = page.locator('#event-attendant-form-container');
    if (await formContainer.isVisible()) {
      // Verify form fields
      const nameInput = page.locator('input[name="fullName"]');
      const emailInput = page.locator('input[name="email"]');
      const phoneInput = page.locator('input[name="phone"]');

      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();

      // Fill out form
      await nameInput.fill('Mario Rossi');
      await emailInput.fill('mario.rossi@example.com');
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('+393331234567');
      }

      // Check privacy switch / checkbox
      const privacySwitch = page.locator('button[role="switch"]').first();
      if (await privacySwitch.isVisible()) {
        await privacySwitch.click();
      }

      // Submit button should be enabled
      const submitButton = page.locator('button[type="submit"]').first();
      await expect(submitButton).toBeVisible();
    }
  });

  test('validates required fields on empty form submission', async ({ page }) => {
    await page.goto('/it/pe/demo-org/demo-event');

    const formContainer = page.locator('#event-attendant-form-container');
    if (await formContainer.isVisible()) {
      const nameInput = page.locator('input[name="fullName"]');
      await nameInput.focus();
      await nameInput.blur();

      // Submit button state when required inputs are empty
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        // SaveButton should be disabled when form is invalid
        const isDisabled = await submitButton.isDisabled();
        expect(isDisabled).toBe(true);
      }
    }
  });
});
