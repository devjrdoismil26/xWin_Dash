import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Settings Accessibility', () => {
  test('settings should be accessible', async ({ page }) => {
    await page.goto('/settings');
    await injectAxe(page);
    await checkA11y(page);
  });
});
