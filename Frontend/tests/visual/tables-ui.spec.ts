import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Tables UI Visual Regression', () => {
  test('data tables', async ({ page }) => {
    await page.goto('/products');
    await percySnapshot(page, 'Data Table');
  });
});
