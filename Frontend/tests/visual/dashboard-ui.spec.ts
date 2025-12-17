import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Dashboard UI Visual Regression', () => {
  test('main dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await percySnapshot(page, 'Main Dashboard');
  });
});
