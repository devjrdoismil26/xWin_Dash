import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Analytics UI Visual Regression', () => {
  test('analytics dashboard', async ({ page }) => {
    await page.goto('/analytics');
    await percySnapshot(page, 'Analytics Dashboard');
  });
});
