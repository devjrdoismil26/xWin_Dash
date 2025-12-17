import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Settings UI Visual Regression', () => {
  test('settings page', async ({ page }) => {
    await page.goto('/settings');
    await percySnapshot(page, 'Settings');
  });
});
