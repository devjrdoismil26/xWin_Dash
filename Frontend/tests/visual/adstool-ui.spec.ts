import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('ADStool UI Visual Regression', () => {
  test('ads dashboard', async ({ page }) => {
    await page.goto('/adstool');
    await percySnapshot(page, 'ADStool Dashboard');
  });
});
