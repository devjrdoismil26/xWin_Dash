import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Forms UI Visual Regression', () => {
  test('form components', async ({ page }) => {
    await page.goto('/products/new');
    await percySnapshot(page, 'Form Components');
  });
});
