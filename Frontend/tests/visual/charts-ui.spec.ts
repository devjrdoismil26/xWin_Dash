import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Charts UI Visual Regression', () => {
  test('chart components', async ({ page }) => {
    await page.goto('/analytics');
    await percySnapshot(page, 'Charts');
  });
});
